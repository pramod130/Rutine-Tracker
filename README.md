# 📱 Discipline Tracker — Full Setup Guide

## 🗂️ Project Structure
```
DisciplineTracker/
├── App.js                          ← Root app + navigation
├── app.json                        ← Expo config
├── package.json                    ← Dependencies
├── index.html                      ← Browser preview (open directly!)
└── src/
    ├── context/
    │   └── HabitContext.js         ← All global state + storage
    ├── screens/
    │   ├── HomeScreen.js           ← Main habit list + calendar
    │   ├── StatsScreen.js          ← Charts + consistency graphs
    │   ├── StreakScreen.js         ← Streaks + achievements
    │   └── ProfileScreen.js        ← Profile + total stats
    └── components/
        └── HabitModal.js           ← Add / edit habit modal
```

---

## 🚀 Step-by-Step Setup in VS Code

### Step 1 — Install Node.js
Download from https://nodejs.org (LTS version)
Verify: open terminal → `node -v`

### Step 2 — Install Expo CLI
```bash
npm install -g expo-cli
```

### Step 3 — Open the project in VS Code
```bash
cd DisciplineTracker
code .
```

### Step 4 — Install all dependencies
```bash
npm install
```
This installs: React Native, Expo, Navigation, Charts, AsyncStorage, Icons

### Step 5 — Run the app
```bash
npx expo start
```
This opens Expo Dev Tools in your browser.

---

## 📱 Run on Your Phone (Easiest!)

1. Install **Expo Go** app on your phone (iOS App Store / Android Play Store)
2. Run `npx expo start` in VS Code terminal
3. Scan the QR code with your phone camera (iOS) or Expo Go app (Android)
4. App loads instantly on your phone! 🎉

---

## 🤖 Run on Android Emulator

1. Install Android Studio: https://developer.android.com/studio
2. Create an emulator: Android Studio → Virtual Device Manager → Create Device
3. Start the emulator
4. In VS Code terminal: `npx expo start` then press `a`

## 🍎 Run on iOS Simulator (Mac only)

1. Install Xcode from Mac App Store
2. Run: `npx expo start` then press `i`

---

## 🌐 Quick Browser Preview

Just open `index.html` in any browser — no install needed!
It's a pixel-perfect HTML prototype of the full app.

---

## 📦 Build & Deploy (Publishing the App)

### Option A — Expo Go (Share with anyone)
```bash
npx expo publish
```
Share the link — anyone with Expo Go can use it!

### Option B — Build APK for Android
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account (free)
eas login

# Configure build
eas build:configure

# Build APK (takes ~5-10 min on Expo servers)
eas build -p android --profile preview
```
Download the APK and install on any Android phone.

### Option C — Build for Google Play Store
```bash
eas build -p android --profile production
eas submit -p android
```

### Option D — Build for iOS App Store
```bash
eas build -p ios --profile production
eas submit -p ios
```
(Requires Apple Developer Account — $99/year)

---

## ✨ App Features

| Feature | Where |
|---------|-------|
| ✅ Daily habit checklist | Home screen |
| 📅 Week calendar strip | Home screen |
| ➕ Add / edit / delete habits | + button or long-press |
| 🎨 Custom icon + color | Add habit modal |
| ⏰ Frequency settings | Add habit modal |
| 😊 Daily mood logger | Home screen |
| 📊 Weekly bar chart | Stats screen |
| 📈 Monthly trend | Stats screen |
| 💯 Habit consistency % | Stats screen |
| 🔥 Live streaks | Streaks screen |
| 🏆 Achievements | Streaks screen |
| 💾 Auto-saves offline | AsyncStorage |

---

## 🛠️ Customization

**Change colors:** Edit `COLORS` array in `HabitContext.js`
**Add more habits:** Edit `DEFAULT_HABITS` in `HabitContext.js`  
**Change app name:** Edit `"name"` in `app.json`
**Add notifications:** Uncomment the expo-notifications code in `HomeScreen.js`

---

## 📦 Dependencies Used

| Package | Purpose |
|---------|---------|
| `expo` | App framework |
| `@react-navigation/native` | Screen navigation |
| `@react-navigation/bottom-tabs` | Tab bar |
| `@react-native-async-storage/async-storage` | Save data offline |
| `react-native-chart-kit` | Bar charts |
| `react-native-svg` | SVG for charts |
| `expo-linear-gradient` | Gradient backgrounds |
| `@expo/vector-icons` | Ionicons |
| `expo-haptics` | Tap vibration |
| `date-fns` | Date utilities |
