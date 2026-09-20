import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [logs, setLogs] = useState([
    {
      id: '1',
      disease: 'Leaf Rust (Puccinia triticina)',
      severity: 'HIGH',
      confidence: '94.8%',
      date: 'Today, 02:40 PM',
      treatment: 'Apply Propiconazole 25% EC (1ml/L). Prune infected leaves and incinerate.'
    },
    {
      id: '2',
      disease: 'Powdery Mildew',
      severity: 'MODERATE',
      confidence: '91.2%',
      date: 'Yesterday, 11:15 AM',
      treatment: 'Spray 5ml/L neem oil solution or wettable sulfur in early morning.'
    }
  ]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera roll permissions are required to scan leaves.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setScanResult(null);
    }
  };

  const runDiagnosis = () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select or capture a crop leaf first.');
      return;
    }

    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const diagnosis = {
        disease: 'Leaf Rust (Puccinia triticina)',
        pathogen: 'Fungal Pathogen',
        confidence: '94.8%',
        severity: 'HIGH',
        treatment: '1. Apply Propiconazole 25% EC @ 1ml/L.\n2. Spray organic neem seed kernel extract (5%).\n3. Reduce overhead irrigation to curtail leaf wetness.',
        prevention: 'Space crops 25cm apart for air circulation.'
      };
      setScanResult(diagnosis);
      setLogs(prev => [
        {
          id: Date.now().toString(),
          disease: diagnosis.disease,
          severity: diagnosis.severity,
          confidence: diagnosis.confidence,
          date: 'Just now',
          treatment: diagnosis.treatment
        },
        ...prev
      ]);
    }, 1800);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0b0f17" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Top Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.logoEmoji}>🌾</Text>
              <Text style={styles.appTitle}>Agri<Text style={styles.greenText}>Flow</Text></Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>SIH20676</Text>
              </View>
            </View>
            <Text style={styles.subtitle}>Smart Agriculture & Crop Intelligence</Text>
          </View>
          <View style={styles.gpsPill}>
            <Text style={styles.gpsText}>📍 28.6139° N, 77.2090° E</Text>
          </View>
        </View>

        {/* 6:00 AM Cron Alert Banner */}
        <View style={styles.alertCard}>
          <View style={styles.alertHeader}>
            <Text style={styles.alertIcon}>🚨</Text>
            <View style={styles.alertTitleContainer}>
              <Text style={styles.alertTitle}>06:00 AM Automated Fungal Warning</Text>
              <Text style={styles.alertThreshold}>Humidity: 84% (Threshold: &gt;80%)</Text>
            </View>
          </View>
          <Text style={styles.alertBody}>
            Extended morning leaf wetness detected. High proliferation risk for Leaf Rust and Powdery Mildew. Apply bio-fungicide within 24h.
          </Text>
        </View>

        {/* Weather 5-Day Card */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🌤️ Farm Weather & Microclimate</Text>
            <View style={styles.riskBadge}>
              <Text style={styles.riskText}>Risk: CRITICAL</Text>
            </View>
          </View>

          <View style={styles.weatherGrid}>
            <View style={styles.weatherStat}>
              <Text style={styles.statLabel}>Temp</Text>
              <Text style={styles.statValue}>29.8°C</Text>
            </View>
            <View style={[styles.weatherStat, styles.statHighlight]}>
              <Text style={styles.statLabel}>Humidity</Text>
              <Text style={styles.statValueRed}>84%</Text>
            </View>
            <View style={styles.weatherStat}>
              <Text style={styles.statLabel}>Wind</Text>
              <Text style={styles.statValue}>4.2 m/s</Text>
            </View>
            <View style={styles.weatherStat}>
              <Text style={styles.statLabel}>Condition</Text>
              <Text style={styles.statValueSmall}>Rain Risk</Text>
            </View>
          </View>

          {/* 5-day strip */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.forecastStrip}>
            {[
              { day: 'Today', temp: '30°', rain: '75%', icon: '🌧️' },
              { day: 'Tue', temp: '28°', rain: '85%', icon: '⛈️' },
              { day: 'Wed', temp: '31°', rain: '40%', icon: '⛅' },
              { day: 'Thu', temp: '32°', rain: '15%', icon: '🌤️' },
              { day: 'Fri', temp: '33°', rain: '10%', icon: '☀️' }
            ].map((item, idx) => (
              <View key={idx} style={styles.forecastItem}>
                <Text style={styles.forecastDay}>{item.day}</Text>
                <Text style={styles.forecastIcon}>{item.icon}</Text>
                <Text style={styles.forecastTemp}>{item.temp}</Text>
                <Text style={styles.forecastRain}>{item.rain}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* AI Crop Disease Scanner */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🔬 AI Crop Disease Scanner</Text>
          <Text style={styles.sectionDesc}>FastAPI Vision Pipeline for SIH20676</Text>

          {selectedImage ? (
            <View style={styles.previewContainer}>
              <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
              {isScanning && (
                <View style={styles.scanningOverlay}>
                  <ActivityIndicator size="large" color="#10b981" />
                  <Text style={styles.scanningText}>Analyzing leaf pathology...</Text>
                </View>
              )}
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadBox} onPress={pickImage} activeOpacity={0.8}>
              <Text style={styles.uploadIcon}>📷</Text>
              <Text style={styles.uploadTitle}>Choose Crop Leaf Photo</Text>
              <Text style={styles.uploadSubtitle}>Tap to select from Gallery or Camera</Text>
            </TouchableOpacity>
          )}

          <View style={styles.actionRow}>
            {selectedImage && !isScanning && !scanResult && (
              <TouchableOpacity style={styles.primaryButton} onPress={runDiagnosis} activeOpacity={0.8}>
                <Text style={styles.primaryButtonText}>Run AI Diagnosis</Text>
              </TouchableOpacity>
            )}
            {selectedImage && (
              <TouchableOpacity style={styles.secondaryButton} onPress={pickImage} activeOpacity={0.8}>
                <Text style={styles.secondaryButtonText}>Change Photo</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Diagnostic Result */}
          {scanResult && (
            <View style={styles.resultBox}>
              <View style={styles.resultHeader}>
                <Text style={styles.diseaseName}>{scanResult.disease}</Text>
                <View style={styles.confidenceBadge}>
                  <Text style={styles.confidenceText}>{scanResult.confidence} Conf.</Text>
                </View>
              </View>

              <Text style={styles.treatmentTitle}>🛡️ Treatment Protocol:</Text>
              <Text style={styles.treatmentText}>{scanResult.treatment}</Text>

              <Text style={styles.preventionTitle}>🌱 Prevention Tip:</Text>
              <Text style={styles.preventionText}>{scanResult.prevention}</Text>
            </View>
          )}
        </View>

        {/* Past CropLog Feed */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>📋 CropLog Diagnostic Feed</Text>
          <Text style={styles.sectionDesc}>Stored in MongoDB CropLog Schema</Text>

          {logs.map((log) => (
            <View key={log.id} style={styles.logCard}>
              <View style={styles.logHeader}>
                <Text style={styles.logDisease}>{log.disease}</Text>
                <View style={styles.highBadge}>
                  <Text style={styles.highBadgeText}>{log.severity}</Text>
                </View>
              </View>
              <Text style={styles.logDate}>{log.date} • {log.confidence}</Text>
              <Text style={styles.logTreatment}>{log.treatment}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f17',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoEmoji: {
    fontSize: 24,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
  },
  greenText: {
    color: '#34d399',
  },
  badge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 4,
  },
  badgeText: {
    color: '#34d399',
    fontSize: 10,
    fontWeight: '700',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  gpsPill: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  gpsText: {
    color: '#34d399',
    fontSize: 10,
    fontWeight: '600',
  },
  alertCard: {
    backgroundColor: 'rgba(127, 29, 29, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  alertIcon: {
    fontSize: 20,
  },
  alertTitleContainer: {
    flex: 1,
  },
  alertTitle: {
    color: '#fca5a5',
    fontWeight: '700',
    fontSize: 13,
  },
  alertThreshold: {
    color: '#ef4444',
    fontSize: 11,
    fontWeight: '600',
  },
  alertBody: {
    color: '#f1f5f9',
    fontSize: 11,
    lineHeight: 16,
  },
  sectionCard: {
    backgroundColor: '#131c2e',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 14,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  sectionDesc: {
    color: '#64748b',
    fontSize: 11,
    marginBottom: 12,
  },
  riskBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  riskText: {
    color: '#f87171',
    fontSize: 10,
    fontWeight: '700',
  },
  weatherGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  weatherStat: {
    flex: 1,
    backgroundColor: '#0b1120',
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  statHighlight: {
    borderColor: 'rgba(239, 68, 68, 0.4)',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 10,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  statValueRed: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  statValueSmall: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
  forecastStrip: {
    marginTop: 4,
  },
  forecastItem: {
    backgroundColor: '#0b1120',
    borderRadius: 10,
    padding: 10,
    marginRight: 8,
    alignItems: 'center',
    minWidth: 64,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  forecastDay: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '600',
  },
  forecastIcon: {
    fontSize: 18,
    marginVertical: 4,
  },
  forecastTemp: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  forecastRain: {
    color: '#38bdf8',
    fontSize: 9,
    marginTop: 2,
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: '#334155',
    borderStyle: 'dashed',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#0b1120',
  },
  uploadIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  uploadTitle: {
    color: '#f1f5f9',
    fontSize: 14,
    fontWeight: '700',
  },
  uploadSubtitle: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 2,
  },
  previewContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
    height: 180,
    backgroundColor: '#000',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  scanningOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanningText: {
    color: '#34d399',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#10b981',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#022c22',
    fontSize: 13,
    fontWeight: '800',
  },
  secondaryButton: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '600',
  },
  resultBox: {
    backgroundColor: '#0b1120',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    padding: 12,
    marginTop: 12,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    paddingBottom: 6,
  },
  diseaseName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  confidenceBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  confidenceText: {
    color: '#34d399',
    fontSize: 10,
    fontWeight: '700',
  },
  treatmentTitle: {
    color: '#34d399',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 3,
  },
  treatmentText: {
    color: '#cbd5e1',
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 6,
  },
  preventionTitle: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 3,
  },
  preventionText: {
    color: '#94a3b8',
    fontSize: 11,
  },
  logCard: {
    backgroundColor: '#0b1120',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 8,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logDisease: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  highBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  highBadgeText: {
    color: '#f87171',
    fontSize: 9,
    fontWeight: '800',
  },
  logDate: {
    color: '#64748b',
    fontSize: 10,
    marginVertical: 3,
  },
  logTreatment: {
    color: '#cbd5e1',
    fontSize: 10,
    lineHeight: 14,
  },
});
