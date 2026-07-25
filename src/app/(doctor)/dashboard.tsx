import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  createMedicalCenter,
  getAssignedMedicalCenters,
  getOwnedMedicalCenters,
  updateMedicalCenter,
} from '@/api/medicalCenter';
import { Input } from '@/components/common/Input';
import { OwnedMedicalCenterCard } from '@/components/doctor/OwnedMedicalCenterCard';
import { Role } from '@/constants/roles';
import { useAuth } from '@/hooks/useAuth';
import { roleDashboardRoute } from '@/navigation/RoleRouter';
import type {
  DoctorOwnedMedicalCentersResponse,
  StandardResponse,
} from '@/types/medicalCenter.types';
import { medicalCenterSchema } from '@/utils/validators';

interface MedicalCenterFormData {
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  opensAt: string;
  closesAt: string;
}

const formatTimeToHHMMSS = (timeStr: string): string => {
  const parts = timeStr.trim().split(':');
  if (parts.length === 2) {
    return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}:00`;
  }
  if (parts.length === 3) {
    return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}:${parts[2].padStart(2, '0')}`;
  }
  return timeStr;
};

const DoctorDashboard = () => {
  const router = useRouter();
  const { role, isHydrating, logout } = useAuth();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingCenter, setEditingCenter] = useState<DoctorOwnedMedicalCentersResponse | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<'owned' | 'assigned'>('owned');
  const [ownedCenters, setOwnedCenters] = useState<DoctorOwnedMedicalCentersResponse[]>([]);
  const [assignedCenters, setAssignedCenters] = useState<DoctorOwnedMedicalCentersResponse[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MedicalCenterFormData>({
    resolver: zodResolver(medicalCenterSchema),
    defaultValues: {
      name: '',
      address: '',
      latitude: '',
      longitude: '',
      opensAt: '08:00:00',
      closesAt: '17:00:00',
    },
  });

  const {
    control: editControl,
    handleSubmit: handleEditSubmit,
    reset: resetEditForm,
    formState: { errors: editErrors, isSubmitting: isEditSubmitting },
  } = useForm<MedicalCenterFormData>({
    resolver: zodResolver(medicalCenterSchema),
    defaultValues: {
      name: '',
      address: '',
      latitude: '',
      longitude: '',
      opensAt: '08:00:00',
      closesAt: '17:00:00',
    },
  });

  useEffect(() => {
    if (!isHydrating && role !== Role.DOCTOR) {
      router.replace(roleDashboardRoute(role));
    }
  }, [isHydrating, role, router]);

  const fetchMedicalCenters = useCallback(async () => {
    setIsLoadingList(true);
    try {
      const [ownedRes, assignedRes] = await Promise.allSettled([
        getOwnedMedicalCenters(),
        getAssignedMedicalCenters(),
      ]);

      const extractArray = (
        val:
          | DoctorOwnedMedicalCentersResponse[]
          | StandardResponse<DoctorOwnedMedicalCentersResponse[]>
          | null
          | undefined,
      ): DoctorOwnedMedicalCentersResponse[] => {
        if (!val) return [];
        if (Array.isArray(val)) return val;
        if ('data' in val && Array.isArray(val.data)) return val.data;
        return [];
      };

      if (ownedRes.status === 'fulfilled' && ownedRes.value != null) {
        const ownedData = extractArray(ownedRes.value);
        setOwnedCenters(ownedData);
      } else if (ownedRes.status === 'rejected') {
        console.error('Failed to fetch owned medical centers:', ownedRes.reason);
      }

      if (assignedRes.status === 'fulfilled' && assignedRes.value != null) {
        const assignedData = extractArray(assignedRes.value);
        setAssignedCenters(assignedData);
      } else if (assignedRes.status === 'rejected') {
        console.error('Failed to fetch assigned medical centers:', assignedRes.reason);
      }
    } catch (err) {
      console.error('Error fetching medical centers:', err);
    } finally {
      setIsLoadingList(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!isHydrating && role === Role.DOCTOR) {
      fetchMedicalCenters();
    }
  }, [isHydrating, role, fetchMedicalCenters]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchMedicalCenters();
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace(roleDashboardRoute(null));
    } catch {
      // ignore
    }
  };

  const onCreateSubmit = async (values: MedicalCenterFormData) => {
    try {
      const payload = {
        name: values.name.trim(),
        address: values.address.trim(),
        latitude: parseFloat(values.latitude),
        longitude: parseFloat(values.longitude),
        opensAt: formatTimeToHHMMSS(values.opensAt),
        closesAt: formatTimeToHHMMSS(values.closesAt),
      };

      const response = await createMedicalCenter(payload);

      if (response.code === 200 || response.data) {
        Alert.alert('Success', 'Medical Center created successfully!');
        reset();
        setIsModalVisible(false);
        fetchMedicalCenters();
      } else {
        Alert.alert('Error', response.message || 'Failed to create medical center');
      }
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        'An error occurred while creating the medical center.';
      Alert.alert('Error', errorMsg);
    }
  };

  const handleEditPress = (center: DoctorOwnedMedicalCentersResponse) => {
    setEditingCenter(center);
    resetEditForm({
      name: center.name || '',
      address: center.address || '',
      latitude: center.latitude != null ? String(center.latitude) : '',
      longitude: center.longitude != null ? String(center.longitude) : '',
      opensAt: center.opensAt || '08:00:00',
      closesAt: center.closesAt || '17:00:00',
    });
    setIsEditModalVisible(true);
  };

  const onUpdateSubmit = async (values: MedicalCenterFormData) => {
    if (!editingCenter?.id) return;
    try {
      const payload = {
        name: values.name.trim(),
        address: values.address.trim(),
        latitude: parseFloat(values.latitude),
        longitude: parseFloat(values.longitude),
        opensAt: formatTimeToHHMMSS(values.opensAt),
        closesAt: formatTimeToHHMMSS(values.closesAt),
      };

      const response = await updateMedicalCenter(editingCenter.id, payload);

      if (response.code === 200 || response.data) {
        Alert.alert('Success', 'Medical Center updated successfully!');
        setIsEditModalVisible(false);
        setEditingCenter(null);
        fetchMedicalCenters();
      } else {
        Alert.alert('Error', response.message || 'Failed to update medical center');
      }
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        'An error occurred while updating the medical center.';
      Alert.alert('Error', errorMsg);
    }
  };

  if (isHydrating || role !== Role.DOCTOR) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  const renderCenterCard = (
    center: DoctorOwnedMedicalCentersResponse,
    index: number,
    sectionKey: string,
  ) => {
    if (!center || typeof center !== 'object') return null;

    const centerId = center.id != null ? String(center.id) : `center-${index}`;
    const hasCoords =
      typeof center.latitude === 'number' && typeof center.longitude === 'number';

    return (
      <View
        key={`${sectionKey}-${centerId}`}
        className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm gap-2"
      >
        <View className="flex-row justify-between items-center mb-0.5">
          <Text className="text-lg font-bold text-slate-900 flex-1 mr-2">
            {center.name ?? 'Unnamed Medical Center'}
          </Text>
          {center.id != null && (
            <View className="bg-slate-100 px-2.5 py-1 rounded-md">
              <Text className="text-xs text-slate-600 font-medium">ID: {center.id}</Text>
            </View>
          )}
        </View>

        {Boolean(center.address) && (
          <Text className="text-sm text-slate-600">📍 {center.address}</Text>
        )}

        {Boolean(center.opensAt || center.closesAt) && (
          <Text className="text-xs text-slate-500">
            ⏰ Operating Hours: {center.opensAt ?? '--'} - {center.closesAt ?? '--'}
          </Text>
        )}

        {hasCoords && (
          <Text className="text-xs text-slate-500">
            🌐 Coordinates: {center.latitude}, {center.longitude}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-slate-50">
      {/* Top Bar Header */}
      <View className="bg-white px-5 pt-12 pb-4 border-b border-slate-200 flex-row items-center justify-between shadow-sm">
        <View>
          <Text className="text-2xl font-bold text-slate-900">Doctor Dashboard</Text>
          <Text className="text-xs text-slate-500 mt-0.5">Manage your medical centers & staff</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleLogout}
          className="bg-red-50 border border-red-200 px-3 py-2 rounded-lg"
        >
          <Text className="text-red-600 font-semibold text-sm">Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 16 }}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        {/* Quick Action Buttons */}
        <View className="gap-2.5">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsModalVisible(true)}
            className="bg-blue-600 py-3.5 px-4 rounded-xl items-center shadow-sm"
          >
            <Text className="text-white font-semibold text-base">+ Create Medical Center</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push('/(doctor)/register-receptionist')}
            className="bg-sky-50 border border-sky-200 py-3 px-4 rounded-xl items-center"
          >
            <Text className="text-sky-700 font-semibold text-sm">+ Register Receptionist</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View className="flex-row bg-slate-200/80 rounded-xl p-1">
          <TouchableOpacity
            key="tab-owned"
            activeOpacity={0.7}
            onPress={() => setActiveTab('owned')}
            style={activeTab === 'owned' ? styles.activeTab : undefined}
            className={`flex-1 py-2.5 items-center rounded-lg ${activeTab === 'owned' ? 'bg-white' : ''
              }`}
          >
            <Text
              className={`text-sm ${activeTab === 'owned' ? 'font-bold text-blue-600' : 'font-medium text-slate-600'
                }`}
            >
              Owned ({ownedCenters.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            key="tab-assigned"
            activeOpacity={0.7}
            onPress={() => setActiveTab('assigned')}
            style={activeTab === 'assigned' ? styles.activeTab : undefined}
            className={`flex-1 py-2.5 items-center rounded-lg ${activeTab === 'assigned' ? 'bg-white' : ''
              }`}
          >
            <Text
              className={`text-sm ${activeTab === 'assigned' ? 'font-bold text-blue-600' : 'font-medium text-slate-600'
                }`}
            >
              Assigned ({assignedCenters.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content Section */}
        {isLoadingList ? (
          <View key="loading-state" className="py-10 items-center">
            <ActivityIndicator size="large" color="#2563eb" />
          </View>
        ) : activeTab === 'owned' ? (
          <View key="owned-section" className="gap-3">
            {ownedCenters.length === 0 ? (
              <View
                key="empty-owned"
                className="bg-white rounded-2xl p-6 border border-slate-200 items-center"
              >
                <Text className="text-base font-semibold text-slate-700">
                  No owned medical centers found.
                </Text>
                <Text className="text-xs text-slate-400 mt-1 text-center">
                  {'Tap "+ Create Medical Center" above to add your first clinic or hospital.'}
                </Text>
              </View>
            ) : (
              <View key="owned-list" className="gap-3">
                {ownedCenters.map((center, index) => (
                  <OwnedMedicalCenterCard
                    key={`owned-${center.id ?? index}`}
                    center={center}
                    onEdit={handleEditPress}
                  />
                ))}
              </View>
            )}
          </View>
        ) : (
          <View key="assigned-section" className="gap-3">
            {assignedCenters.length === 0 ? (
              <View
                key="empty-assigned"
                className="bg-white rounded-2xl p-6 border border-slate-200 items-center"
              >
                <Text className="text-base font-semibold text-slate-700">
                  No assigned medical centers found.
                </Text>
              </View>
            ) : (
              <View key="assigned-list" className="gap-3">
                {assignedCenters.map((center, index) =>
                  renderCenterCard(center, index, 'assigned'),
                )}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Modal for Create Medical Center */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center p-4">
          <View className="bg-white rounded-2xl p-5 max-h-[90%] shadow-xl">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-slate-900">Create Medical Center</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIsModalVisible(false)}
                className="p-1 rounded-lg"
              >
                <Text className="text-lg font-bold text-slate-400">✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ gap: 12 }}>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Input
                    label="Medical Center Name"
                    placeholder="e.g. City Care Hospital"
                    value={field.value}
                    onChangeText={field.onChange}
                    error={errors.name?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="address"
                render={({ field }) => (
                  <Input
                    label="Address"
                    placeholder="e.g. 123 Main St, Colombo"
                    value={field.value}
                    onChangeText={field.onChange}
                    error={errors.address?.message}
                  />
                )}
              />

              <View className="flex-row gap-2.5">
                <View className="flex-1">
                  <Controller
                    control={control}
                    name="latitude"
                    render={({ field }) => (
                      <Input
                        label="Latitude"
                        placeholder="e.g. 6.9271"
                        keyboardType="numeric"
                        value={field.value}
                        onChangeText={field.onChange}
                        error={errors.latitude?.message}
                      />
                    )}
                  />
                </View>
                <View className="flex-1">
                  <Controller
                    control={control}
                    name="longitude"
                    render={({ field }) => (
                      <Input
                        label="Longitude"
                        placeholder="e.g. 79.8612"
                        keyboardType="numeric"
                        value={field.value}
                        onChangeText={field.onChange}
                        error={errors.longitude?.message}
                      />
                    )}
                  />
                </View>
              </View>

              <View className="flex-row gap-2.5">
                <View className="flex-1">
                  <Controller
                    control={control}
                    name="opensAt"
                    render={({ field }) => (
                      <Input
                        label="Opens At (HH:mm:ss)"
                        placeholder="08:00:00"
                        value={field.value}
                        onChangeText={field.onChange}
                        error={errors.opensAt?.message}
                      />
                    )}
                  />
                </View>
                <View className="flex-1">
                  <Controller
                    control={control}
                    name="closesAt"
                    render={({ field }) => (
                      <Input
                        label="Closes At (HH:mm:ss)"
                        placeholder="17:00:00"
                        value={field.value}
                        onChangeText={field.onChange}
                        error={errors.closesAt?.message}
                      />
                    )}
                  />
                </View>
              </View>

              <View className="flex-row gap-2.5 mt-2">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setIsModalVisible(false)}
                  disabled={isSubmitting}
                  className="flex-1 bg-slate-200 py-3 rounded-xl items-center"
                >
                  <Text className="text-slate-700 font-semibold text-base">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleSubmit(onCreateSubmit)}
                  disabled={isSubmitting}
                  className={`flex-1 bg-blue-600 py-3 rounded-xl items-center ${isSubmitting ? 'opacity-50' : ''
                    }`}
                >
                  <Text className="text-white font-semibold text-base">
                    {isSubmitting ? 'Creating...' : 'Create'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal for Edit Medical Center */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setIsEditModalVisible(false);
          setEditingCenter(null);
        }}
      >
        <View className="flex-1 bg-black/50 justify-center p-4">
          <View className="bg-white rounded-2xl p-5 max-h-[90%] shadow-xl">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-slate-900">
                Edit Medical Center{editingCenter?.id != null ? ` (ID: ${editingCenter.id})` : ''}
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setIsEditModalVisible(false);
                  setEditingCenter(null);
                }}
                className="p-1 rounded-lg"
              >
                <Text className="text-lg font-bold text-slate-400">✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ gap: 12 }}>
              <Controller
                control={editControl}
                name="name"
                render={({ field }) => (
                  <Input
                    label="Medical Center Name"
                    placeholder="e.g. City Care Hospital"
                    value={field.value}
                    onChangeText={field.onChange}
                    error={editErrors.name?.message}
                  />
                )}
              />

              <Controller
                control={editControl}
                name="address"
                render={({ field }) => (
                  <Input
                    label="Address"
                    placeholder="e.g. 123 Main St, Colombo"
                    value={field.value}
                    onChangeText={field.onChange}
                    error={editErrors.address?.message}
                  />
                )}
              />

              <View className="flex-row gap-2.5">
                <View className="flex-1">
                  <Controller
                    control={editControl}
                    name="latitude"
                    render={({ field }) => (
                      <Input
                        label="Latitude"
                        placeholder="e.g. 6.9271"
                        keyboardType="numeric"
                        value={field.value}
                        onChangeText={field.onChange}
                        error={editErrors.latitude?.message}
                      />
                    )}
                  />
                </View>
                <View className="flex-1">
                  <Controller
                    control={editControl}
                    name="longitude"
                    render={({ field }) => (
                      <Input
                        label="Longitude"
                        placeholder="e.g. 79.8612"
                        keyboardType="numeric"
                        value={field.value}
                        onChangeText={field.onChange}
                        error={editErrors.longitude?.message}
                      />
                    )}
                  />
                </View>
              </View>

              <View className="flex-row gap-2.5">
                <View className="flex-1">
                  <Controller
                    control={editControl}
                    name="opensAt"
                    render={({ field }) => (
                      <Input
                        label="Opens At (HH:mm:ss)"
                        placeholder="08:00:00"
                        value={field.value}
                        onChangeText={field.onChange}
                        error={editErrors.opensAt?.message}
                      />
                    )}
                  />
                </View>
                <View className="flex-1">
                  <Controller
                    control={editControl}
                    name="closesAt"
                    render={({ field }) => (
                      <Input
                        label="Closes At (HH:mm:ss)"
                        placeholder="17:00:00"
                        value={field.value}
                        onChangeText={field.onChange}
                        error={editErrors.closesAt?.message}
                      />
                    )}
                  />
                </View>
              </View>

              <View className="flex-row gap-2.5 mt-2">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setIsEditModalVisible(false);
                    setEditingCenter(null);
                  }}
                  disabled={isEditSubmitting}
                  className="flex-1 bg-slate-200 py-3 rounded-xl items-center"
                >
                  <Text className="text-slate-700 font-semibold text-base">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleEditSubmit(onUpdateSubmit)}
                  disabled={isEditSubmitting}
                  className={`flex-1 bg-blue-600 py-3 rounded-xl items-center ${
                    isEditSubmitting ? 'opacity-50' : ''
                  }`}
                >
                  <Text className="text-white font-semibold text-base">
                    {isEditSubmitting ? 'Updating...' : 'Update'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  activeTab: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default DoctorDashboard;
