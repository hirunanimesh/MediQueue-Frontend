import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import type { DoctorOwnedMedicalCentersResponse } from '@/types/medicalCenter.types';

interface OwnedMedicalCenterCardProps {
  center: DoctorOwnedMedicalCentersResponse;
  onEdit: (center: DoctorOwnedMedicalCentersResponse) => void;
}

export const OwnedMedicalCenterCard: React.FC<OwnedMedicalCenterCardProps> = ({
  center,
  onEdit,
}) => {
  if (!center || typeof center !== 'object') return null;

  const hasCoords =
    typeof center.latitude === 'number' && typeof center.longitude === 'number';

  return (
    <View className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm gap-2">
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

      <View className="flex-row justify-end mt-2 pt-2 border-t border-slate-100">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onEdit(center)}
          className="bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-lg flex-row items-center gap-1.5"
        >
          <Text className="text-blue-600 font-semibold text-xs">✏️ Edit Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
