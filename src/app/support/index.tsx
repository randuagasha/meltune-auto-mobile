import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Send, User, Wrench, ShieldCheck } from 'lucide-react-native';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { AppHeader } from '@/components/layout/AppHeader';
import { PREVIEW_SUPPORT_THREAD } from '@/services/previewData';
import { MeltuneColors, Radius, Spacing, Typography, Shadows } from '@/theme';

export default function SupportCenterScreen() {
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState(PREVIEW_SUPPORT_THREAD.messages);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMsg = {
      id: `msg_${Date.now()}`,
      senderId: 'usr_meltune_01',
      senderName: 'Randu Pradana',
      senderRole: 'customer' as const,
      content: inputText.trim(),
      createdAt: 'Baru saja',
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');
  };

  return (
    <GradientBackground variant="subtleIvory">
      <AppHeader
        title="Service Advisor"
        subtitle="Konsultasi Teknis & Workbay Meltune BSD"
        tag="LIVE ADVISOR DESK"
        showBack
      />

      {/* Vehicle Context Banner */}
      <View style={styles.contextBanner}>
        <Wrench size={16} color={MeltuneColors.burntOrange} />
        <Text style={styles.contextText}>
          Subjek: {PREVIEW_SUPPORT_THREAD.subject}
        </Text>
      </View>

      {/* Messages Scroll Area */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.messageList,
          { paddingBottom: insets.bottom + 80 },
        ]}
      >
        {messages.map(msg => {
          const isMe = msg.senderRole === 'customer';
          return (
            <View
              key={msg.id}
              style={[
                styles.messageRow,
                isMe ? styles.messageRowMe : styles.messageRowAdvisor,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  isMe ? styles.bubbleMe : styles.bubbleAdvisor,
                  Shadows.subtle,
                ]}
              >
                <View style={styles.senderHeader}>
                  <Text
                    style={[
                      styles.senderName,
                      isMe ? styles.senderNameMe : styles.senderNameAdvisor,
                    ]}
                  >
                    {msg.senderName}
                  </Text>
                  <Text
                    style={[
                      styles.timestamp,
                      isMe ? styles.timestampMe : styles.timestampAdvisor,
                    ]}
                  >
                    {msg.createdAt}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.messageContent,
                    isMe ? styles.contentMe : styles.contentAdvisor,
                  ]}
                >
                  {msg.content}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Message Input Bottom Bar */}
      <View
        style={[
          styles.inputBar,
          { paddingBottom: Math.max(insets.bottom, 12) },
          Shadows.darkElevated,
        ]}
      >
        <TextInput
          placeholder="Tanyakan keluhan atau jadwal servis..."
          placeholderTextColor={MeltuneColors.textMutedLight}
          value={inputText}
          onChangeText={setInputText}
          style={styles.textInput}
        />
        <Pressable
          onPress={handleSend}
          style={({ pressed }) => [
            styles.sendButton,
            pressed && styles.sendButtonPressed,
          ]}
        >
          <Send size={16} color={MeltuneColors.white} />
        </Pressable>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  contextBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: MeltuneColors.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: MeltuneColors.borderLight,
  },
  contextText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.bold,
    color: MeltuneColors.charcoal,
    flex: 1,
  },
  messageList: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    gap: Spacing.md,
  },
  messageRow: {
    flexDirection: 'row',
  },
  messageRowMe: {
    justifyContent: 'flex-end',
  },
  messageRowAdvisor: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '82%',
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  bubbleMe: {
    backgroundColor: MeltuneColors.charcoal,
    borderBottomRightRadius: Radius.xs,
  },
  bubbleAdvisor: {
    backgroundColor: MeltuneColors.white,
    borderWidth: 1,
    borderColor: MeltuneColors.borderLight,
    borderBottomLeftRadius: Radius.xs,
  },
  senderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    gap: Spacing.sm,
  },
  senderName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.micro,
    fontWeight: Typography.weight.bold,
  },
  senderNameMe: {
    color: MeltuneColors.champagne,
  },
  senderNameAdvisor: {
    color: MeltuneColors.burntOrange,
  },
  timestamp: {
    fontFamily: Typography.fontFamilyMono,
    fontSize: 9,
  },
  timestampMe: {
    color: MeltuneColors.textMutedDark,
  },
  timestampAdvisor: {
    color: MeltuneColors.textMutedLight,
  },
  messageContent: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    lineHeight: 18,
  },
  contentMe: {
    color: MeltuneColors.warmIvory,
  },
  contentAdvisor: {
    color: MeltuneColors.charcoal,
  },
  inputBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: MeltuneColors.white,
    borderTopWidth: 1,
    borderTopColor: MeltuneColors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    gap: Spacing.sm,
  },
  textInput: {
    flex: 1,
    backgroundColor: MeltuneColors.surfaceLightElevated,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.size.caption,
    color: MeltuneColors.charcoal,
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: Radius.pill,
    backgroundColor: MeltuneColors.burntOrange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonPressed: {
    backgroundColor: MeltuneColors.orangePressed,
  },
});
