<!-- PassengerList.vue -->
<template>
    <div class="passenger-list mt-8">
      <h2 class="text-2xl font-bold mb-4">버스 {{ bus.number }} 탑승자 목록</h2>
      <div class="mb-4">
        <span class="font-bold">총 좌석:</span> 45석 |
        <span class="font-bold">탑승:</span> {{ presentPassengers }} 명 |
        <span class="font-bold">미탑승:</span> {{ absentPassengers }} 명 |
        <span class="font-bold">빈 자리:</span> {{ emptySeats }} 석
      </div>
      <div class="mb-4">
        <button @click="resetAttendance" class="bg-red-500 text-white px-4 py-2 rounded mr-4">초기화</button>
        <label class="inline-flex items-center">
          <input type="checkbox" v-model="editMode" class="form-checkbox">
          <span class="ml-2">탑승자변경</span>
        </label>
      </div>
      <ul class="space-y-2">
        <li v-for="(passenger, index) in displayPassengers" :key="index" class="p-2 border rounded flex items-center">
          <div @click="toggleAttendance(passenger)" 
               class="flex-grow cursor-pointer" 
               :class="{
                 'bg-green-100': passenger.isPresent, 
                 'bg-red-100': !passenger.isPresent && passenger.name, 
                 'bg-blue-100': !passenger.name
               }">
            <span class="font-bold mr-2">{{ index + 1 }}.</span>
            <span v-if="index < 2" class="font-bold">{{ index === 0 ? '차장' : '부차장' }}:</span>
            <input v-if="editMode" 
                   v-model="passenger.name" 
                   class="bg-transparent border-b border-gray-400 focus:outline-none focus:border-blue-500"
                   @input="handleNameChange(passenger)"
                   @blur="updatePassengerName(passenger)">
            <span v-else>{{ passenger.name || '' }}</span>
            - {{ getStatus(passenger) }}
          </div>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  
  export default {
    props: {
      bus: {
        type: Object,
        required: true,
      },
    },
    emits: ['update-attendance', 'update-passenger-name'],
    setup(props, { emit }) {
      const editMode = ref(false);
  
      const displayPassengers = computed(() => {
        const passengers = [...props.bus.passengers];
        while (passengers.length < 45) {
          passengers.push({ name: '', isPresent: false, seatNumber: passengers.length + 1 });
        }
        return passengers;
      });
  
      const presentPassengers = computed(() => {
        return displayPassengers.value.filter(p => p.isPresent).length;
      });
  
      const absentPassengers = computed(() => {
        return displayPassengers.value.filter(p => !p.isPresent && p.name).length;
      });
  
      const emptySeats = computed(() => {
        return displayPassengers.value.filter(p => !p.name).length;
      });
  
      const getStatus = (passenger) => {
        if (!passenger.name) return '빈 자리';
        return passenger.isPresent ? '탑승' : '미탑승';
      };
  
      const toggleAttendance = (passenger) => {
        if (!editMode.value && passenger.name) {
          emit('update-attendance', props.bus.number, passenger.seatNumber, !passenger.isPresent);
        }
      };
  
      const resetAttendance = () => {
        displayPassengers.value.forEach(passenger => {
          if (passenger.name) {
            emit('update-attendance', props.bus.number, passenger.seatNumber, false);
          }
        });
      };
  
      const handleNameChange = (passenger) => {
        if (passenger.name && !passenger.isPresent) {
          emit('update-attendance', props.bus.number, passenger.seatNumber, false);
        }
      };
  
      const updatePassengerName = (passenger) => {
        emit('update-passenger-name', props.bus.number, passenger.seatNumber, passenger.name);
      };
  
      return {
        editMode,
        displayPassengers,
        presentPassengers,
        absentPassengers,
        emptySeats,
        getStatus,
        toggleAttendance,
        resetAttendance,
        handleNameChange,
        updatePassengerName,
      };
    },
  };
  </script>