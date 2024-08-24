const STORAGE_KEY = 'bus-attendance-data';

export default {
  getData() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  },

  setData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  getBusData(busNumber) {
    const data = this.getData();
    return data[busNumber] || [];
  },

  setBusData(busNumber, busData) {
    const data = this.getData();
    data[busNumber] = busData;
    this.setData(data);
  },

  updatePassengerStatus(busNumber, seatNumber, isPresent) {
    const busData = this.getBusData(busNumber);
    const passengerIndex = busData.findIndex(p => p.seatNumber === seatNumber);
    if (passengerIndex !== -1) {
      busData[passengerIndex].isPresent = isPresent;
      this.setBusData(busNumber, busData);
    }
  }
};