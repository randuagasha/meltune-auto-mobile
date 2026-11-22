import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check, Clock, Circle } from 'lucide-react-native';
import { ServiceStage } from '@/types';
import { MeltuneColors, Radius, Spacing, Typography } from '@/theme';

interface BookingTimelineProps {
  stages: ServiceStage[];
  workbayNumber?: string;
  assignedMechanic?: string;
}

export const BookingTimeline: React.FC<BookingTimelineProps> = ({
  stages,
  workbayNumber,
  assignedMechanic,
}) => {
  return (
    <View style={styles.container}>
      {/* Workbay & Tech Header */}
      {(workbayNumber || assignedMechanic) && (
        <View style={styles.metaRow}>
          {workbayNumber && (
            <View style={styles.metaBadge}>
              <Text style={styles.metaLabel}>STASIUN KERJA</Text>
              <Text style={styles.metaValue}>{workbayNumber}</Text>
            </View>
          )}
          {assignedMechanic && (
            <View style={styles.metaBadge}>
              <Text style={styles.metaLabel}>KEPALA MEKANIK</Text>
              <Text style={styles.metaValue}>{assignedMechanic}</Text>
            </View>
          )}
        </View>
      )}

      {/* Stage Timeline */}
      <View style={styles.timelineList}>
        {stages.map((stage, index) => {
          const isCompleted = stage.status === 'completed';
          const isActive = stage.status === 'active';
          const isLast = index === stages.length - 1;
          const stageCode = `STG-0${index + 1}`;

          return (
            <View key={stage.id} style={styles.stageItem}>
              {/* Left Column: Technical Indicator and Line */}
              <View style={styles.indicatorColumn}>
                <View
                  style={[
                    styles.nodeBox,
                    isCompleted && styles.nodeBoxCompleted,
                    isActive && styles.nodeBoxActive,
                  ]}
                >
                  {isCompleted ? (
                    <Check size={11} color={MeltuneColors.white} />
                  ) : isActive ? (
                    <View style={styles.activePulse} />
                  ) : (
                    <View style={styles.pendingDot} />
                  )}
                </View>

                {!isLast && (
                  <View
                    style={[
                      styles.connectorLine,
                      isCompleted && styles.connectorLineCompleted,
                    ]}
                  />
                )}
              </View>

              {/* Right Column: Stage Details */}
              <View style={styles.stageContent}>
                <View style={styles.stageHeader}>
                  <View style={styles.stageCodeRow}>
                    <Text style={styles.stageCode}>{stageCode}</Text>
                    <Text
                      style={[
                        styles.stageName,
                        isActive && styles.stageNameActive,
                        isCompleted && styles.stageNameCompleted,
                      ]}
                    >
                      {stage.name}
                    </Text>
                  </View>

                  {stage.timestamp && (
                    <Text style={styles.timestamp}>{stage.timestamp}</Text>
                  )}
                </View>

                <Text style={styles.stageDescription}>{stage.description}</Text>

                {stage.technicianNotes && (
                  <View style={styles.notesBox}>
                    <Text style={styles.notesPrefix}>CATATAN TEKNISI:</Text>
                    <Text style={styles.notesText}>{stage.technicianNotes}</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: MeltuneColors.white,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: 'rgba(36, 37, 34, 0.12)',
    padding: Spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(36, 37, 34, 0.08)',
  },
  metaBadge: {
    flex: 1,
    backgroundColor: MeltuneColors.surfaceLightElevated,
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: 'rgba(36, 37, 34, 0.06)',
  },
  metaLabel: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 8,
    color: MeltuneColors.textMutedLight,
    letterSpacing: 1,
  },
  metaValue: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
    marginTop: 2,
  },
  timelineList: {
    paddingLeft: Spacing.xxs,
  },
  stageItem: {
    flexDirection: 'row',
    minHeight: 56,
  },
  indicatorColumn: {
    alignItems: 'center',
    width: 22,
  },
  nodeBox: {
    width: 18,
    height: 18,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: 'rgba(36, 37, 34, 0.25)',
    backgroundColor: MeltuneColors.surfaceLightElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeBoxCompleted: {
    backgroundColor: MeltuneColors.charcoal,
    borderColor: MeltuneColors.charcoal,
  },
  nodeBoxActive: {
    backgroundColor: 'rgba(217, 107, 58, 0.15)',
    borderColor: MeltuneColors.burntOrange,
  },
  activePulse: {
    width: 6,
    height: 6,
    borderRadius: 1,
    backgroundColor: MeltuneColors.burntOrange,
  },
  pendingDot: {
    width: 4,
    height: 4,
    borderRadius: 1,
    backgroundColor: 'rgba(36, 37, 34, 0.25)',
  },
  connectorLine: {
    flex: 1,
    width: 1,
    backgroundColor: 'rgba(36, 37, 34, 0.12)',
    marginVertical: 3,
  },
  connectorLineCompleted: {
    backgroundColor: MeltuneColors.charcoal,
  },
  stageContent: {
    flex: 1,
    paddingLeft: Spacing.md,
    paddingBottom: Spacing.md,
  },
  stageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stageCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stageCode: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 9,
    color: MeltuneColors.burntOrange,
    fontWeight: Typography.weight.bold,
  },
  stageName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.semibold,
    color: MeltuneColors.charcoal,
  },
  stageNameActive: {
    color: MeltuneColors.burntOrange,
    fontWeight: Typography.weight.extrabold,
  },
  stageNameCompleted: {
    color: MeltuneColors.charcoal,
    fontWeight: Typography.weight.bold,
  },
  timestamp: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 9,
    color: MeltuneColors.textMutedLight,
  },
  stageDescription: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textSecondaryLight,
    marginTop: 2,
    lineHeight: 14,
  },
  notesBox: {
    backgroundColor: MeltuneColors.surfaceLightMuted,
    borderRadius: Radius.xs,
    padding: Spacing.xs,
    marginTop: Spacing.xs,
    borderLeftWidth: 2,
    borderLeftColor: MeltuneColors.burntOrange,
  },
  notesPrefix: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 8,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.burntOrange,
    letterSpacing: 0.5,
  },
  notesText: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.micro,
    color: MeltuneColors.charcoal,
    marginTop: 1,
  },
});
