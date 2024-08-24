<!-- App.vue -->
<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-3xl font-bold">{{ dynamicTitle }}</h1>
      <div class="relative group">
        <button @click="resetAllData" class="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition duration-300">
          <ArrowPathIcon class="w-6 h-6 text-gray-600" />
        </button>
        <span class="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 right-0 bottom-full mb-2">
          전체 초기화
        </span>
      </div>
    </div>
    
    <!-- 카테고리 선택 -->
    <div v-if="!selectedBus" class="mb-4">
      <label for="category-select" class="block mb-2 font-bold">날짜 및 방향 선택:</label>
      <select 
        id="category-select" 
        v-model="selectedCategory" 
        @change="onCategoryChange"
        class="w-full p-2 border rounded"
      >
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>

    <!-- 버스 목록 -->
    <div v-if="!selectedBus && selectedCategory" class="grid grid-cols-3 gap-4">
      <BusItem
        v-for="bus in busesInSelectedCategory"
        :key="bus.number"
        :bus="bus"
        @click="selectBus(bus)"
      />
    </div>

    <!-- 뒤로 가기 버튼 -->
    <button 
      v-if="selectedBus" 
      @click="goBack" 
      class="mb-4 bg-gray-500 text-white px-4 py-2 rounded"
    >
      뒤로 가기
    </button>

    <!-- 탑승자 목록 -->
    <PassengerList
      v-if="selectedBus"
      :bus="selectedBus"
      @update-attendance="updateAttendance"
      @update-passenger-name="updatePassengerName"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import BusItem from './components/BusItem.vue';
import PassengerList from './components/PassengerList.vue';

const STORAGE_KEY = 'bus-attendance-data';

const loadFromLocalStorage = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};

const saveToLocalStorage = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export default {
  components: {
    BusItem,
    PassengerList,
  },
  setup() {
    const busData = ref({});
    const selectedBus = ref(null);
    const selectedCategory = ref("");
    const categories = computed(() => Object.keys(busData.value));

    const busesInSelectedCategory = computed(() => {
      if (!selectedCategory.value || !busData.value[selectedCategory.value]) {
        return [];
      }
      return busData.value[selectedCategory.value];
    });

    const dynamicTitle = computed(() => {
      const port = window.location.port;
      const prefix = port === '89' ? '학생 ' : '장년 ';
      return prefix + '버스 탑승 출석 체크';
    });

    const loadBusData = async () => {
      try {
        const localData = loadFromLocalStorage();
        if (localData) {
          busData.value = localData;
        } else {
          
          const portNo = window.location.port;
          let jsonFile = '/json/bus-schedule-adt.json';
          if ( portNo == 89 ){
            jsonFile = '/json/bus-schedule-std.json';
          }
          let response = await fetch(jsonFile);
          if (!response.ok) {
            jsonFile = '/json/bus-schedule-sample.json';
            response = await fetch(jsonFile);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
          }
          busData.value = await response.json();
          saveToLocalStorage(busData.value);
        }
        if (categories.value.length > 0) {
          selectedCategory.value = categories.value[0];
        }
      } catch (e) {
        console.error("Could not load bus schedule data:", e);
      }
    };

    onMounted(loadBusData);

    const selectBus = (bus) => {
      selectedBus.value = bus;
    };

    const goBack = () => {
      selectedBus.value = null;
    };

    const updateAttendance = (busNumber, seatNumber, isPresent) => {
      const bus = busesInSelectedCategory.value.find(b => b.number === busNumber);
      if (bus) {
        const passenger = bus.passengers.find(p => p.seatNumber === seatNumber);
        if (passenger) {
          passenger.isPresent = isPresent;
          saveToLocalStorage(busData.value);
        }
      }
    };

    const updatePassengerName = (busNumber, seatNumber, newName) => {
      const bus = busesInSelectedCategory.value.find(b => b.number === busNumber);
      if (bus) {
        const passenger = bus.passengers.find(p => p.seatNumber === seatNumber);
        if (passenger) {
          passenger.name = newName;
          saveToLocalStorage(busData.value);
        }
      }
    };

    const onCategoryChange = () => {
      selectedBus.value = null;
    };

    const resetAllData = () => {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    };



    return {
      busData,
      selectedBus,
      selectedCategory,
      categories,
      busesInSelectedCategory,
      selectBus,
      updateAttendance,
      updatePassengerName,
      onCategoryChange,
      goBack,
      resetAllData,
      dynamicTitle
    };
  },
};
</script>