import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle2, Clock, Circle } from 'lucide-react-native';
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
              <Text style={styles.metaLabel}>WORKBAY</Text>
              <Text style={styles.metaValue}>{workbayNumber}</Text>
            </View>
          )}
          {assignedMechanic && (
            <View style={styles.metaBadge}>
              <Text style={styles.metaLabel}>TEKNISI JAGA</Text>
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

          return (
            <View key={stage.id} style={styles.stageItem}>
              {/* Left Column: Icon and Vertical Connector */}
              <View style={styles.indicatorColumn}>
                <View
                  style={[
                    styles.iconBox,
                    isCompleted && styles.iconBoxCompleted,
                    isActive && styles.iconBoxActive,
                  ]}
                >
                  {isCompleted ? (
                    <CheckCircle2 size={16} color={MeltuneColors.statusSuccess} />
                  ) : isActive ? (
                    <Clock size={16} color={MeltuneColors.burntOrange} />
                  ) : (
                    <Circle size={14} color={MeltuneColors.borderLight} />
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

              {/* Right Column: Stage Description */}
              <View style={styles.stageContent}>
                <View style={styles.stageHeader}>
                  <Text
                    style={[
                      styles.stageName,
                      isActive && styles.stageNameActive,
                      isCompleted && styles.stageNameCompleted,
                    ]}
                  >
                    {stage.name}
                  </Text>
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
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
    padding: Spacing.lg,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: MeltuneColors.borderLight,
  },
  metaBadge: {
    flex: 1,
    backgroundColor: MeltuneColors.surfaceLightElevated,
    padding: Spacing.sm,
    borderRadius: Radius.sm,
  },
  metaLabel: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 9,
    color: MeltuneColors.textMutedLight,
    letterSpacing: 1,
  },
  metaValue: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
    marginTop: 2,
  },
  timelineList: {
    paddingLeft: Spacing.xs,
  },
  stageItem: {
    flexDirection: 'row',
    minHeight: 64,
  },
  indicatorColumn: {
    alignItems: 'center',
    width: 28,
  },
  iconBox: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.pill,
    backgroundColor: MeltuneColors.surfaceLightElevated,
  },
  iconBoxCompleted: {
    backgroundColor: MeltuneColors.statusSuccessBg,
  },
  iconBoxActive: {
    backgroundColor: '#FFEDD5',
    borderWidth: 1.5,
    borderColor: MeltuneColors.burntOrange,
  },
  connectorLine: {
    flex: 1,
    width: 2,
    backgroundColor: MeltuneColors.borderLight,
    marginVertical: 4,
  },
  connectorLineCompleted: {
    backgroundColor: MeltuneColors.statusSuccess,
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
  stageName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.body,
    fontWeight: Typography.weight.semibold,
    color: MeltuneColors.charcoal,
  },
  stageNameActive: {
    color: MeltuneColors.burntOrange,
    fontWeight: Typography.weight.extrabold,
  },
  stageNameCompleted: {
    color: MeltuneColors.charcoal,
  },
  timestamp: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: Typography.size.micro,
    color: MeltuneColors.textMutedLight,
  },
  stageDescription: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.textSecondaryLight,
    marginTop: 2,
    lineHeight: Typography.lineHeight.caption,
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
    fontSize: 9,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.burntOrange,
    letterSpacing: 0.5,
  },
  notesText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    color: MeltuneColors.charcoal,
    marginTop: 1,
  },
});
