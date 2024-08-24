<template>
    <div
      class="bus-item p-4 border rounded-lg cursor-pointer hover:bg-gray-100"
      @click="$emit('click')"
    >
      <svg class="w-full h-auto" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="30" width="180" height="60" rx="10" fill="#4A90E2"/>
        <rect x="20" y="40" width="20" height="20" fill="#FFFFFF"/>
        <rect x="50" y="40" width="20" height="20" fill="#FFFFFF"/>
        <rect x="80" y="40" width="20" height="20" fill="#FFFFFF"/>
        <rect x="110" y="40" width="20" height="20" fill="#FFFFFF"/>
        <rect x="140" y="40" width="20" height="20" fill="#FFFFFF"/>
        <circle cx="50" cy="95" r="10" fill="#333333"/>
        <circle cx="150" cy="95" r="10" fill="#333333"/>
      </svg>
      <div class="text-center mt-2 font-bold">{{ bus.number }}</div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      bus: {
        type: Object,
        required: true,
      },
    },
  };
  </script>