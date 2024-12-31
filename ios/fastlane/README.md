fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew install fastlane`

# Available Actions
## iOS
### ios get_version
```
fastlane ios get_version
```

### ios sync_device_info
```
fastlane ios sync_device_info
```

### ios increment_version_code
```
fastlane ios increment_version_code
```

### ios increment_version_name
```
fastlane ios increment_version_name
```

### ios firebase_staging
```
fastlane ios firebase_staging
```
Push a new staging build to Firebase App Distribution
### ios commit_version
```
fastlane ios commit_version
```

### ios handle_badge
```
fastlane ios handle_badge
```

### ios sign
```
fastlane ios sign
```
Sync All Cert & Provisioning Profile (Match => Github)
### ios build
```
fastlane ios build
```

### ios upload_to_store
```
fastlane ios upload_to_store
```

### ios staging
```
fastlane ios staging
```
Push a new staging build
### ios release
```
fastlane ios release
```
Push a new release build

----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
