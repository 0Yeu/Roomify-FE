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
## Android
### android get_version
```
fastlane android get_version
```

### android increment_version_code
```
fastlane android increment_version_code
```

### android increment_version_name
```
fastlane android increment_version_name
```

### android firebase_staging
```
fastlane android firebase_staging
```
Push a new staging build to Firebase App Distribution
### android commit_version
```
fastlane android commit_version
```

### android handle_badge
```
fastlane android handle_badge
```

### android build
```
fastlane android build
```

### android upload_to_store
```
fastlane android upload_to_store
```

### android test
```
fastlane android test
```
Android Testing
### android staging
```
fastlane android staging
```
Push a new staging build
### android release
```
fastlane android release
```
Push a new release build

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
