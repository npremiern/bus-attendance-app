function generatePassengers(busNumber) {
    return Array.from({ length: 45 }, (_, index) => ({
      seatNumber: index + 1,
      name: `승객${busNumber}-${index + 1}`,
      isPresent: Math.random() < 0.7 // 70% 확률로 탑승 중
    }));
  }
  
  export const sampleBusData = {
    '1001': generatePassengers('1001'),
    '1002': generatePassengers('1002'),
    '1003': generatePassengers('1003')
  };
  
  export function initializeLocalStorage() {
    localStorage.setItem('bus-attendance-data', JSON.stringify(sampleBusData));
  }