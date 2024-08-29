
class Vector3 {
  constructor(x,y,z) {
    this.x = x
    this.y = y
    this.z = z
  }
  serialize = () => {
    var data = new Float32Array([this.x, this.y, this.z]);
    var buffer = new ArrayBuffer(data.byteLength);
    var floatView = new Float32Array(buffer).set(data);
    var bytes = new Uint8Array(buffer);
    return bytes
  }
}

class Twist {
  constructor(linear, angular) {
    this.linear = linear
    this.angular = angular
  }
  serialize = () => {
    var linear_bytes = this.linear.serialize();
    var angular_bytes = this.angular.serialize();
    var bytes = new Uint8Array(linear_bytes.length + angular_bytes.length);
    bytes.set(linear_bytes);
    bytes.set(angular_bytes, linear_bytes.length);
    return bytes
  }
}

class BLEController {
  constructor() {
    document.getElementById('connectButton').addEventListener('click', this.connect);
//    document.getElementById('sendButton').addEventListener('click', sendMessage);
    this.connected = false
    this.twist = null;
  }

  BOGIEBOT_BLE_SERVICE = "96f2414a-ab16-4aa4-8716-b7acfbac0adb";
  CMD_VEL = "8387ecb2-551e-4665-83e4-7f0fffd1f850";

  bleDevice;

  connect = async () => {
      try {
          document.getElementById('btn-text').innerText = "Connecting...";
          document.getElementById('btn-text').disabled = true
          this.bleDevice = await navigator.bluetooth.requestDevice({
              filters: [{ services: [this.BOGIEBOT_BLE_SERVICE] }]
          });
          const server = await this.bleDevice.gatt.connect();
          const service = await server.getPrimaryService(this.BOGIEBOT_BLE_SERVICE);
          this.cmd_vel = await service.getCharacteristic(this.CMD_VEL);
          document.getElementById('btn-text').innerText = "Connected";
          document.getElementById('btn-text').disabled = false
          document.getElementById('bt-status').color = "green";
          this.connected = true
      } catch (error) {
          console.error('Connection failed!', error);
          document.getElementById('btn-text').innerText = "Connect";
          document.getElementById('btn-text').disabled = false
          document.getElementById('bt-status').color = "red";
      }
  }

  send_cmd_vel = (twist) => {
    this.twist = twist
    if (this.timeout) clearTimeout(this.timeout)
    this.timeout = setTimeout(()=>this._send_cmd(), 1);
  }

  _send_cmd = async () => {
    try {
      await this.cmd_vel.writeValue(this.twist.serialize());
      console.log('sent', this.twist)
    } catch(e) {
      console.log(e)
      if (e.name == 'NetworkError') {
        this.timeout = setTimeout(()=>this._send_cmd(), 100);
      }
    }
  }

}

