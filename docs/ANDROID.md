# Android build (Capacitor)

The Android app is a thin native wrapper around the standalone web build
(`dist-web/`, the same bundle itch.io's HTML5 channel gets). It is produced with
[Capacitor](https://capacitorjs.com): the WebView loads the built SPA from the
APK's assets, so there is no server and the app works fully offline.

Verified so far: `npm run build:web` + `cap sync` + a debug APK
(`gradlew :app:assembleDebug`) builds and packages cleanly with Capacitor 8.5,
compileSdk 36, and Android Studio's JBR 21, with the real launcher icon in
place. Not yet done: release signing config, release AAB, Play/itch listing, CI.

## Layout

| Path                                  | What it is                       | Tracked in git    |
| ------------------------------------- | -------------------------------- | ----------------- |
| `capacitor.config.json`               | App id, name, `webDir: dist-web` | yes               |
| `android/`                            | Generated native Gradle project  | yes               |
| `android/app/src/main/assets/public/` | Copied web build                 | no (`.gitignore`) |
| `dist-web/`                           | `npm run build:web` output       | no (`.gitignore`) |

`android/` is committed so the native config (icons, manifest, signing setup)
survives. Regenerate it any time with `npx cap add android` after deleting it.

## Prerequisites

- **Android Studio** (latest). Install the Android SDK, an SDK Platform (API 35
  or newer), and Build-Tools through its SDK Manager.
- **JDK 21.** `android/app/capacitor.build.gradle` pins source/target
  compatibility to Java 21, and the bundled Gradle 8.14.3 tops out around JDK 24,
  so the JDK 25 currently in `JAVA_HOME` on this machine will not work. Use the
  JetBrains Runtime that ships with Android Studio (verified working):
  - building from inside Android Studio picks it up automatically, or
  - for the CLI, set `JAVA_HOME` for the Gradle invocation:
    ```powershell
    $env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
    npm run android:apk
    ```
  The `android:*` npm scripts do **not** set `JAVA_HOME` themselves; export it
  first (or run them from a shell where it already points at a 17-24 JDK).
- `local.properties` in `android/` must point at the SDK (this file is
  git-ignored - it is machine-specific). Android Studio writes it on first open;
  for the CLI create it by hand. **Use forward slashes** - backslashes are parsed
  as `.properties` escapes and `\U`, `\A` etc. produce `java.io.IOException:
Invalid file path` at build time:
  ```
  sdk.dir=C:/Users/gamer/AppData/Local/Android/Sdk
  ```

## Everyday workflow

```bash
npm run android:sync    # build:web + cap sync android  (run after any web change)
npm run android:open     # sync, then open the project in Android Studio
```

From Android Studio: pick a device/emulator and Run. Or from the CLI:

```bash
npm run android:apk      # sync + gradlew assembleRelease -> APK (unsigned until signing is set up)
npm run android:bundle   # sync + gradlew bundleRelease   -> .aab for Play
```

Outputs land in `android/app/build/outputs/`. These two scripts call
`gradlew.bat`, so they are Windows-only; on other platforms run
`npm run android:sync` then `./gradlew` in `android/` yourself.

## Versioning

`android/app/build.gradle` reads the root `package.json` `version` at build time:

- `versionName` = that string verbatim (`1.3.1`)
- `versionCode` = `major*10000 + minor*100 + patch` (`1.3.1` -> `10301`)

So the single-bump rule from [RELEASING.md](RELEASING.md) still holds: change
`package.json` only. `versionCode` must never decrease between Play uploads; the
formula keeps it monotonic as long as each part stays below its multiplier.

## Signing (required for Play, and for a stable itch.io/sideload identity)

1. Generate a keystore once (keep it and its passwords safe and out of git):
   ```powershell
   & "$env:JAVA_HOME\bin\keytool" -genkey -v `
     -keystore ttbg-release.jks -alias ttbg `
     -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Create `android/keystore.properties` (`keystore.properties`, `*.jks` and
   `*.keystore` are already listed in `android/.gitignore`):
   ```
   storeFile=../../ttbg-release.jks
   storePassword=...
   keyAlias=ttbg
   keyPassword=...
   ```
3. Wire it into `android/app/build.gradle`:
   ```gradle
   def ksProps = new Properties()
   def ksFile = rootProject.file("keystore.properties")
   if (ksFile.exists()) ksProps.load(new FileInputStream(ksFile))

   android {
       signingConfigs {
           release {
               if (ksFile.exists()) {
                   storeFile file(ksProps['storeFile'])
                   storePassword ksProps['storePassword']
                   keyAlias ksProps['keyAlias']
                   keyPassword ksProps['keyPassword']
               }
           }
       }
       buildTypes {
           release {
               signingConfig signingConfigs.release
               // ...existing lines...
           }
       }
   }
   ```

Without this, `assembleRelease` produces an unsigned APK that must be signed
with `apksigner` before it will install.

## App icon

The launcher icon is generated from two committed source images by
[scripts/gen-android-icons.mjs](../scripts/gen-android-icons.mjs) (`sharp`):

| Source (1024x1024, in `assets/`) | Used for                                                                          |
| -------------------------------- | --------------------------------------------------------------------------------- |
| `icon-foreground-src.png`        | planet/ring/moon on transparent bg - the adaptive foreground and the legacy icons |
| `icon-full-src.png`              | same mark on solid `#030712` - the Play Store 512 listing icon                    |

```bash
npm run android:icons     # rewrites android/app/src/main/res/mipmap-* and the
                          # adaptive XML, then run: npx cap sync android
```

What it writes into `android/app/src/main/res/`:

- `mipmap-anydpi-v26/ic_launcher{,_round}.xml` - adaptive icon whose
  `<background>` is the flat colour `@color/ic_launcher_background` (`#030712`,
  in `values/ic_launcher_background.xml`) and whose `<foreground>` is
  `@mipmap/ic_launcher_foreground`. A flat-colour background always fills the
  full 108dp drawable, so no mask shape leaves a seam.
- `mipmap-*/ic_launcher_foreground.png` - the mark at 58% of the canvas, which
  keeps it inside the 66dp adaptive-icon safe zone on every mask (circle,
  squircle, rounded square).
- `mipmap-*/ic_launcher.png` / `ic_launcher_round.png` - opaque `#030712`
  square / disc for API 24-25 (below adaptive icons).

The script also deletes the stock vector layers
(`drawable/ic_launcher_background.xml`, `drawable-v24/ic_launcher_foreground.xml`)
since the adaptive XML no longer references them, and writes
`assets/play-store-icon-512.png` for the Play Console listing.

To change the icon: replace the two `*-src.png` files (keep them 1024x1024,
same framing), then `npm run android:icons && npx cap sync android`. Adjust the
`FG_SCALE` / `LEGACY_SCALE` / `ROUND_SCALE` constants in the script to retune how
much of each icon the mark fills.

The splash screen is left at the Capacitor default. `public/alien-rpg-tools.ico`
is only 256x256, too small to reuse as an icon source.

## Distribution options

- **itch.io**: `butler push android/app/build/outputs/apk/release/app-release.apk
abstract-engineer/alien-rpg-tools:android --userversion <version>`. Add an
  `android` channel alongside `windows` / `linux` / `html5`.
- **Google Play**: upload the `.aab` from `android:bundle`. One-time $25
  developer account. Play re-signs with an app-signing key; keep your upload
  keystore safe regardless.

## CI (optional, not yet wired)

To add Android to `.github/workflows/release.yml`, add a job on
`ubuntu-latest` that:

1. `actions/setup-java@v4` with `distribution: temurin`, `java-version: 21`
2. `android-actions/setup-android@v3`
3. `npm install && npm run build:web`
4. decode the keystore from a secret, write `keystore.properties`
5. `cd android && ./gradlew bundleRelease assembleRelease`
6. upload the `.aab` / `.apk` as artifacts and (optionally) `butler push` the APK

Keep the keystore and its passwords as GitHub Actions secrets, never in the repo.
