<script setup>
import { ref } from 'vue';

const comment = ref('');
const comments = ref([]);

const submitComment = () => {
  comments.value.push(comment.value);
  comment.value = '';
};
</script>

<template>
  <div>
    <h3>Comments</h3>
    <input v-model="comment" placeholder="Leave a comment" />
    <button @click="submitComment">Submit</button>
    <div>
      <p v-for="(com, index) in comments" :key="index">{{ com }}</p>
    </div>
  </div>
</template>
