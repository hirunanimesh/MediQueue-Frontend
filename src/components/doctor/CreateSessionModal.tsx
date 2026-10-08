import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { createSessionTemplate } from '@/api/sessionTemplate';
import type { DoctorOwnedMedicalCentersResponse } from '@/types/medicalCenter.types';

const DAYS_OF_WEEK = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
] as const;

interface CreateSessionModalProps {
  visible: boolean;
  onClose: () => void;
  medicalCenters: DoctorOwnedMedicalCentersResponse[];
  onSessionCreated?: () => void;
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

export const CreateSessionModal: React.FC<CreateSessionModalProps> = ({
  visible,
  onClose,
  medicalCenters,
  onSessionCreated,
}) => {
  const [selectedCenterId, setSelectedCenterId] = useState<number | null>(null);
  const [isCenterDropdownOpen, setIsCenterDropdownOpen] = useState(false);
  const [dayOfWeek, setDayOfWeek] = useState<string>('MONDAY');
  const [isDayDropdownOpen, setIsDayDropdownOpen] = useState(false);
  const [startTime, setStartTime] = useState('08:00:00');
  const [endTime, setEndTime] = useState('14:00:00');
  const [maxPatients, setMaxPatients] = useState('');
  const [active, setActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCenter = medicalCenters.find((c) => c.id === selectedCenterId);

  const resetForm = () => {
    setSelectedCenterId(null);
    setIsCenterDropdownOpen(false);
    setDayOfWeek('MONDAY');
    setIsDayDropdownOpen(false);
    setStartTime('08:00:00');
    setEndTime('14:00:00');
    setMaxPatients('');
    setActive(true);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    // Validation
    if (selectedCenterId == null) {
      Alert.alert('Validation Error', 'Please select a medical center.');
      return;
    }
    if (!startTime.trim()) {
      Alert.alert('Validation Error', 'Please enter a start time.');
      return;
    }
    if (!endTime.trim()) {
      Alert.alert('Validation Error', 'Please enter an end time.');
      return;
    }
    if (!maxPatients.trim() || isNaN(Number(maxPatients)) || Number(maxPatients) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid max patients number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        medicalCenterId: selectedCenterId,
        dayOfWeek,
        startTime: formatTimeToHHMMSS(startTime),
        endTime: formatTimeToHHMMSS(endTime),
        maxPatients: parseInt(maxPatients, 10),
        active,
      };

      const response = await createSessionTemplate(payload);

      if (response.code === 200 || response.data) {
        Alert.alert('Success', 'Session template created successfully!');
        resetForm();
        onClose();
        onSessionCreated?.();
      } else {
        Alert.alert('Error', response.message || 'Failed to create session template.');
      }
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        'An error occurred while creating the session template.';
      Alert.alert('Error', errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/50 justify-center p-4">
        <View className="bg-white rounded-2xl p-5 max-h-[90%] shadow-xl">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-slate-900">Create Session</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleClose}
              className="p-1 rounded-lg"
            >
              <Text className="text-lg font-bold text-slate-400">✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ gap: 14 }} showsVerticalScrollIndicator={false}>
            {/* Medical Center Dropdown */}
            <View className="gap-1.5">
              <Text className="text-sm font-medium text-slate-700">Medical Center</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setIsCenterDropdownOpen(!isCenterDropdownOpen);
                  setIsDayDropdownOpen(false);
                }}
                className={`border rounded-lg px-3 py-3 flex-row justify-between items-center ${
                  isCenterDropdownOpen ? 'border-blue-500' : 'border-slate-300'
                }`}
              >
                <Text
                  className={`text-sm flex-1 ${
                    selectedCenter ? 'text-slate-900' : 'text-slate-400'
                  }`}
                  numberOfLines={1}
                >
                  {selectedCenter ? selectedCenter.name : 'Select a medical center'}
                </Text>
                <Text className="text-slate-400 text-xs ml-2">
                  {isCenterDropdownOpen ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>

              {isCenterDropdownOpen && (
                <View className="border border-slate-200 rounded-lg bg-white shadow-sm max-h-40">
                  <ScrollView nestedScrollEnabled={true}>
                    {medicalCenters.length === 0 ? (
                      <View className="px-3 py-3">
                        <Text className="text-sm text-slate-400 text-center">
                          No medical centers available
                        </Text>
                      </View>
                    ) : (
                      medicalCenters.map((center) => (
                        <TouchableOpacity
                          key={`center-option-${center.id}`}
                          activeOpacity={0.7}
                          onPress={() => {
                            setSelectedCenterId(center.id);
                            setIsCenterDropdownOpen(false);
                          }}
                          className={`px-3 py-2.5 border-b border-slate-100 ${
                            selectedCenterId === center.id ? 'bg-blue-50' : ''
                          }`}
                        >
                          <Text
                            className={`text-sm ${
                              selectedCenterId === center.id
                                ? 'text-blue-700 font-semibold'
                                : 'text-slate-700'
                            }`}
                          >
                            {center.name}
                          </Text>
                          {center.address && (
                            <Text className="text-xs text-slate-400 mt-0.5" numberOfLines={1}>
                              {center.address}
                            </Text>
                          )}
                        </TouchableOpacity>
                      ))
                    )}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Day of Week Dropdown */}
            <View className="gap-1.5">
              <Text className="text-sm font-medium text-slate-700">Day of Week</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setIsDayDropdownOpen(!isDayDropdownOpen);
                  setIsCenterDropdownOpen(false);
                }}
                className={`border rounded-lg px-3 py-3 flex-row justify-between items-center ${
                  isDayDropdownOpen ? 'border-blue-500' : 'border-slate-300'
                }`}
              >
                <Text className="text-sm text-slate-900">
                  {dayOfWeek.charAt(0) + dayOfWeek.slice(1).toLowerCase()}
                </Text>
                <Text className="text-slate-400 text-xs ml-2">
                  {isDayDropdownOpen ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>

              {isDayDropdownOpen && (
                <View className="border border-slate-200 rounded-lg bg-white shadow-sm max-h-48">
                  <ScrollView nestedScrollEnabled={true}>
                    {DAYS_OF_WEEK.map((day) => (
                      <TouchableOpacity
                        key={`day-option-${day}`}
                        activeOpacity={0.7}
                        onPress={() => {
                          setDayOfWeek(day);
                          setIsDayDropdownOpen(false);
                        }}
                        className={`px-3 py-2.5 border-b border-slate-100 ${
                          dayOfWeek === day ? 'bg-blue-50' : ''
                        }`}
                      >
                        <Text
                          className={`text-sm ${
                            dayOfWeek === day
                              ? 'text-blue-700 font-semibold'
                              : 'text-slate-700'
                          }`}
                        >
                          {day.charAt(0) + day.slice(1).toLowerCase()}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Start Time & End Time */}
            <View className="flex-row gap-2.5">
              <View className="flex-1 gap-1.5">
                <Text className="text-sm font-medium text-slate-700">Start Time</Text>
                <TextInput
                  className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 bg-white"
                  placeholder="08:00:00"
                  value={startTime}
                  onChangeText={setStartTime}
                  placeholderTextColor="#94a3b8"
                />
              </View>
              <View className="flex-1 gap-1.5">
                <Text className="text-sm font-medium text-slate-700">End Time</Text>
                <TextInput
                  className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 bg-white"
                  placeholder="14:00:00"
                  value={endTime}
                  onChangeText={setEndTime}
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>

            {/* Max Patients */}
            <View className="gap-1.5">
              <Text className="text-sm font-medium text-slate-700">Max Patients</Text>
              <TextInput
                className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 bg-white"
                placeholder="e.g. 20"
                value={maxPatients}
                onChangeText={setMaxPatients}
                keyboardType="numeric"
                placeholderTextColor="#94a3b8"
              />
            </View>

            {/* Active Toggle */}
            <View className="flex-row items-center justify-between bg-slate-50 rounded-lg px-3 py-3">
              <View className="flex-1">
                <Text className="text-sm font-medium text-slate-700">Active</Text>
                <Text className="text-xs text-slate-400 mt-0.5">
                  Enable this session template immediately
                </Text>
              </View>
              <Switch
                value={active}
                onValueChange={setActive}
                trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
                thumbColor={active ? '#2563eb' : '#f1f5f9'}
              />
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-2.5 mt-2">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleClose}
                disabled={isSubmitting}
                className="flex-1 bg-slate-200 py-3 rounded-xl items-center"
              >
                <Text className="text-slate-700 font-semibold text-base">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleSubmit}
                disabled={isSubmitting}
                className={`flex-1 bg-blue-600 py-3 rounded-xl items-center ${
                  isSubmitting ? 'opacity-50' : ''
                }`}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text className="text-white font-semibold text-base">Create</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
