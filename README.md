# Install expo cli globally

Install expo-cli in specific version.

```shell
npm install -g expo-cli@4.12.1 
```

# Installing dependencies

```shell
yarn install
```

# Starting expo wrapper 

```shell
yarn start
```

# Running client in android simulator

Press 'a' in a console where yarn start was entered.

# Running client in ios simulator

Press 'i' in console where yarn start was entered.

# Running client on android device

1. Install Expo Go from Google Play:
   https://play.google.com/store/apps/details?id=host.exp.exponent&hl=pl&gl=US
   
2. Scan QR Code from browser with Expo Go app:
   http://localhost:19002/
   
3. Add corresponding settings inside "Settings" tab in the application. localhost does not work, it has to be IP of the host,
for example: 192.168.1.10:8080
   
