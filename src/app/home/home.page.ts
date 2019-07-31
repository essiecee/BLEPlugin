import { Component, NgZone } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';
import { BLE } from '@ionic-native/ble';

const device_ID = 'C1E746FB-C055-A37D-D7DA-009CF1E61837';
// for beacon: 'C1E746FB-C055-A37D-D7DA-009CF1E61837';
// for flicker: '887F55AA-4AA6-F381-CD4B-8CBE4EE11961';
const service_ID = '2220';
const characteristic_ID = '2222';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  devices: any[] = [];
  statusMessage: string;

  constructor(
    public navCtrl: NavController, 
    private toastCtrl: ToastController,
    // an Angular service
    private ngZone: NgZone,
  ) { }

  ngOnInit() {

  }

  scan() {
    this.setStatus('Scanning for Bluetooth LE Devices');
    this.devices = [];  // clear list

    // [] means scan for all devices
    // 5 means scan for 5 seconds
    // Calling subscribe allows us to listen in on any data that is coming through
    // If we receive a device, then we will call onDeviceDiscovered
    // IF we encounter an error, then we will call scanError
    // This scan displays all devices that have the service 2220
    // BLE.scan(["2220"], 5).subscribe(
    //   device => this.onDeviceDiscovered(device), 
    //   error => this.scanError(error)
    // );
    
    // This only displays Beacon when it is powered on
    BLE.startScanWithOptions([service_ID], {
      reportDuplicates: false
    }).subscribe(
      device => this.onDeviceDiscovered(device), 
      error => this.scanError(error)
    );
  }

  onDeviceDiscovered(device) {
    // device is the value to be converted to a JSON string
    // null means include all properties of the device in the resulting JSON string
    // 2 means include 2 units of white space into the output JSON string for readability
    console.log('Discovered ' + JSON.stringify(device, null, 2));
    this.ngZone.run(() => {
      this.devices.push(device);
    });
    this.autoConnect();
  }

  autoConnect() {
    BLE.autoConnect(device_ID, 
    function(peripheralData) {
      console.log(peripheralData);
      console.log('Success! CONNECTED.');
      document.getElementById("button").innerHTML = "Connected!";
    },
    function() {
      document.getElementById("button").innerHTML = "Unable to connect.";
      console.log('Error! Unable to connect.');
    });
  }

  sendTestData() {
    var data = new Uint16Array(1);
    data[0] = 500;
    // had to cast the SharedArrayBuffer to an ArrayBuffer for compatability purposes
    // service_id is 2220
    // characteristic_id is 2222 or 2223
    BLE.write(device_ID, service_ID, characteristic_ID, data.buffer as ArrayBuffer).then(
      () => console.log("Successfully wrote data. " + data),
      e => console.log("Failed to write. " + e)
    );
   }

  connect() {
    // After connecting to a Bluetooth device, pressing the Scan button will make the device disappear in the list of results
    // because the device is now connected to the phone, which means that the device is no longer available
    // to connect to 
    // BLE.connect('C1E746FB-C055-A37D-D7DA-009CF1E61837').subscribe(peripheralData => {
    //   console.log(peripheralData);
    //   console.log("connected");
    // },
    // peripheralData => {
    //   console.log('disconnected');
    // });
    // BLE.stopScan();
  }

  scanError(error) {
    console.log(error);
  }

  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }
}

// import { UuidsService } from '../uuids.service';

// @Component({
//   selector: 'app-home',
//   templateUrl: 'home.page.html',
//   styleUrls: ['home.page.scss'],
// })

// export class HomePage {
//   uuids = {};
//   foundDevices = [];
//   constructor(
//     public navCtrl: NavController,
//     private uuidsService: UuidsService,
//     public platform: Platform
//   ) {
//     document.addEventListener('deviceready', function () {
//       new Promise(function (resolve) {
//           bluetoothle.initialize(resolve, { request: true, statusReceiver: false });
//       }).then(this.initializeSuccess, this.handleError);
//     });
//     this.uuids = uuidsService.getUuids();
//    }

//   ngOnInit() {
//   }

//   initializeSuccess(result) {
//     if (result.status === "enabled") {
//         console.log("Bluetooth is enabled.");
//         console.log(result);
//     }
//     else {
//         //document.getElementById("start-scan").disabled = true;
//         this.log("Bluetooth is not enabled:", "status");
//         this.log(result, "status");
//     }
//   }

//   handleError(error) {
//     var msg = "";
//     // if (error.error && error.message) {
//     //     var errorItems = [];
//     //     if (error.service) {
//     //         errorItems.push("service: " + (this.uuids[error.service] || error.service));
//     //     }
//     //     if (error.characteristic) {
//     //         errorItems.push("characteristic: " + (this.uuids[error.characteristic] || error.characteristic));
//     //     }
//     //     msg = "Error on " + error.error + ": " + error.message + (errorItems.length && (" (" + errorItems.join(", ") + ")"));
//     // }
//     // else {
//     //     msg = error;
//     // }
//     // //this.log(msg, "error");
//     // if (error.error === "read" && error.service && error.characteristic) {
//     //     this.reportValue(error.service, error.characteristic, "Error: " + error.message);
//     // }
//   }

//   log(msg, level) {
//     level = level || "log";
//     if (typeof msg === "object") {
//         msg = JSON.stringify(msg, null, "  ");
//     }
//     console.log(msg);
//     if (level === "status" || level === "error") {
//         var msgDiv = document.createElement("div");
//         msgDiv.textContent = msg;
//         if (level === "error") {
//             msgDiv.style.color = "red";
//         }
//         msgDiv.style.padding = "5px 0";
//         msgDiv.style.borderBottom = "rgb(192,192,192) solid 1px";
//         document.getElementById("output").appendChild(msgDiv);
//     }
//   }

//   reportValue(serviceUuid, characteristicUuid, value) {
//     document.getElementById(serviceUuid + "." + characteristicUuid).textContent = value;
//   }

//   startScan() {
//     this.log("Starting scan for devices...", "status");
//     console.log("can we even print to console");
//     document.getElementById("devices").innerHTML = "";
//     document.getElementById("services").innerHTML = "";
//     document.getElementById("output").innerHTML = "";
    
//     //var platformID = device.platform;
//     if (!(this.platform.is("android") || this.platform.is("ios"))) {
//         bluetoothle.retrieveConnected(this.retrieveConnectedSuccess, this.handleError, {});
//     }
//     else {
//         bluetoothle.startScan(this.startScanSuccess, this.handleError, { services: [] });
//     }
//   }

//   async startScanSuccess(result) {
//     console.log("startScanSuccess(" + result.status + ")");
//     if (result.status == "scanStarted") {
//         this.log("Scanning for devices (will continue to scan until you select a device)...", "status");
//     }
//     else if (result.status == "scanResult") {
//         if (!this.foundDevices.some(function (device) {
//             return device.address == result.address;
//         })) {
//             console.log('FOUND DEVICE:');
//             console.log(result);
//             await this.foundDevices.push(result);
//             await this.addDevice(result.name, result.address);
//         }
//     }
//   } 

//   retrieveConnectedSuccess(result) {
//     console.log("retrieveConnectedSuccess()");
//     console.log(result);
//     result.forEach(async function (device) {
//         await this.addDevice(device.name, device.address);
//     });
//   }

//   addDevice(name, address) {
//     var button = document.createElement("button");
//     button.style.width = "100%";
//     button.style.padding = "10px";
//     button.style.fontSize = "16px";
//     button.textContent = name + ": " + address;
//     button.addEventListener("click", function () {
//         document.getElementById("services").innerHTML = "";
//         // this.connect(address);
//     });
//     this.connect(address);
//     document.getElementById("devices").appendChild(button);
//   }

//   connect(address) {
//     this.log('Connecting to device: ' + address + "...", "status");
//     if (cordova.platformId === "windows") {
//         this.getDeviceServices(address);
//     }
//     else {
//         this.stopScan();
//         new Promise(function (resolve, reject) {
//             bluetoothle.connect(resolve, reject, { address: address });
//         }).then(this.connectSuccess, this.handleError);
//     }
//   }

//   stopScan() {
//     new Promise(function (resolve, reject) {
//         bluetoothle.stopScan(resolve, reject);
//     }).then(this.stopScanSuccess, this.handleError);
//   }

//   stopScanSuccess() {
//     if (!this.foundDevices.length) {
//         console.log("NO DEVICES FOUND");
//     }
//     else {
//         this.log("Found " + this.foundDevices.length + " devices.", "status");
//     }
//   }

//   connectSuccess(result) {
//     console.log("- " + result.status);
//     if (result.status === "connected") {
//         this.getDeviceServices(result.address);
//     }
//     else if (result.status === "disconnected") {
//        this.log("Disconnected from device: " + result.address, "status");
//     }
//   }

//   getDeviceServices(address) {
//     this.log("Getting device services...", "status");
//     var platform = window.cordova.platformId;
//     if (platform === "android") {
//         new Promise(function (resolve, reject) {
//             bluetoothle.discover(resolve, reject,
//                 { address: address });
//         }).then(this.discoverSuccess, this.handleError);
//     }
//     else if (platform === "windows") {
//         new Promise(function (resolve, reject) {
//             bluetoothle.services(resolve, reject,
//                 { address: address });
//         }).then(this.servicesSuccess, this.handleError);
//     }
//     else {
//        this.log("Unsupported platform: '" + window.cordova.platformId + "'", "error");
//     }
//   }

//   discoverSuccess(result) {
//     console.log("Discover returned with status: " + result.status);
//     if (result.status === "discovered") {
//     // Create a chain of read promises so we don't try to read a property until we've finished
//         // reading the previous property.
//     var readSequence = result.services.reduce(function (sequence, service) {
//         return sequence.then(function () {
//             return this.addService(result.address, service.uuid, service.characteristics);
//         });
 
//     }, Promise.resolve());
//     // Once we're done reading all the values, disconnect
//     readSequence.then(function () {
//         new Promise(function (resolve, reject) {
//             bluetoothle.disconnect(resolve, reject,
//                 { address: result.address });
//         }).then(this.connectSuccess, this.handleError);
//     });
//     }
//   }

//   servicesSuccess(result) {
//     console.log("servicesSuccess()");
//     console.log(result);
//     if (result.status === "services") {
//         var readSequence = result.services.reduce(function (sequence, service) {
//             return sequence.then(function () {
//                 console.log('Executing promise for service: ' + service);
//                 new Promise(function (resolve, reject) {
//                     bluetoothle.characteristics(resolve, reject,
//                         { address: result.address, service: service });
//                 }).then(this.characteristicsSuccess, this.handleError);
//             }, this.handleError);
//         }, Promise.resolve());
//         // Once we're done reading all the values, disconnect
//         readSequence.then(function () {
//             new Promise(function (resolve, reject) {
//                 bluetoothle.disconnect(resolve, reject,
//                     { address: result.address });
//             }).then(this.connectSuccess, this.handleError);
//         });
//     }
 
//     if (result.status === "services") {
//         result.services.forEach(function (service) {
//             new Promise(function (resolve, reject) {
//                 bluetoothle.characteristics(resolve, reject,
//                     { address: result.address, service: service });
//             }).then(this.characteristicsSuccess, this.handleError);
//         });
//     }
//   }

//   characteristicsSuccess(result) {
//     console.log("characteristicsSuccess()");
//     console.log(result);
//     if (result.status === "characteristics") {
//         return this.addService(result.address, result.service, result.characteristics);
//     }
//   }

//   addService(address, serviceUuid, characteristics) {
//     console.log('Adding service ' + serviceUuid + '; characteristics:');
//     console.log(characteristics);
//     var readSequence = Promise.resolve();
 
//     var wrapperDiv = document.createElement("div");
//     wrapperDiv.className = "service-wrapper";
 
//     var serviceDiv = document.createElement("div");
//     serviceDiv.className = "service";
//     serviceDiv.textContent = this.uuids[serviceUuid] || serviceUuid;
//     wrapperDiv.appendChild(serviceDiv);
 
//     characteristics.forEach(function (characteristic) {
 
//         var characteristicDiv = document.createElement("div");
//         characteristicDiv.className = "characteristic";
 
//         var characteristicNameSpan = document.createElement("span");
//         characteristicNameSpan.textContent = (this.uuids[characteristic.uuid] || characteristic.uuid) + ":";
//         characteristicDiv.appendChild(characteristicNameSpan);
//         characteristicDiv.appendChild(document.createElement("br"));
//         var characteristicValueSpan = document.createElement("span");
//         characteristicValueSpan.id = serviceUuid + "." + characteristic.uuid;
//         characteristicValueSpan.style.color = "blue";
//         characteristicDiv.appendChild(characteristicValueSpan);
//         wrapperDiv.appendChild(characteristicDiv);
//         readSequence = readSequence.then(function () {
//             return new Promise<any>(function (resolve, reject) {
//                 bluetoothle.read(resolve, reject,
//                     { address: address, service: serviceUuid, characteristic: characteristic.uuid });
//             }).then(this.readSuccess, this.handleError);
 
//         });
//     });
//     document.getElementById("services").appendChild(wrapperDiv);
//     return readSequence;
//   }

//   readSuccess(result) {
//     console.log("readSuccess():");
//     console.log(result);
//     if (result.status === "read") {
//         this.reportValue(result.service, result.characteristic, window.atob(result.value));
//     }
//   }
// }

// @Component({
//   selector: 'app-home',
//   templateUrl: 'home.page.html',
//   styleUrls: ['home.page.scss'],
// })

// export class HomePage {
//   constructor(public bluetoothle: BluetoothLE, public plt: Platform) {

//     this.plt.ready().then((readySource) => {
  
//       console.log('Platform ready from', readySource);
  
//       this.bluetoothle.initialize().toPromise().then(ble => {
//         console.log('ble', ble.status) // logs 'enabled'
//       });
  
//     });
//   }
