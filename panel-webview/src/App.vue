<script setup lang="ts">
import ImagePreview from './ImagePreview.vue';
import { ref, defineComponent } from 'vue';
import useClipboard from 'vue-clipboard3';

const { toClipboard } = useClipboard();
const copy = async (url: string) => {
  try {
    await toClipboard(url);
    vscode.postMessage({
    command: 'copySuccess',
    });
  } catch (e) {
    console.error(e);
  }
}

const vscode = window?.acquireVsCodeApi?.();
const images = ref<{
  local: string;
  url: string;
  webviewUrl: string;
  size: string;
}[]>([]);

const x = ref(0);
const y = ref(0);
const url = ref();
const show = ref(false);

window.addEventListener('message', event => {
  const message = event.data;
  switch (message.command) {
    case 'img':
      const data = message?.data?.img;
      images.value = data;
      break;
  }
});

const openFile = (img: any) => {
  vscode.postMessage({
    command: 'openFile',
    data: JSON.stringify(img),
  });
};

const imageMouseover = (path: string, event: any) => {
  console.log(event, 'event看看');
  x.value = event.clientX;
  y.value = event.clientY;
  url.value = path;
  show.value = true;
};
const imageMouseout = (path: string, event: any) => {
  x.value = 0;
  y.value = 0;
  url.value = '';
  show.value = false;
};
</script>

<template>
  <div class="panel">
    <h2>img2cdn local upload result</h2>
    <div class="total">
      total: {{ images.length }}
    </div>
    <table>
      <colgroup class="column1"></colgroup>
      <colgroup class="column2"></colgroup>
      <colgroup class="column3"></colgroup>
      <colgroup class="column4"></colgroup>
      <colgroup class="column5"></colgroup>
      <thead>
        <tr>
          <th>No.</th>
          <th>size</th>
          <th>image</th>
          <th>image file</th>
          <th>cdn url</th>
        </tr>
      </thead>
      <tbody v-if="images.length > 0">
        <tr v-for="(item, index) in images" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ item.size }}</td>
          <td>
            <img :src="item?.webviewUrl || ''" alt="" @mouseover="imageMouseover(item?.webviewUrl, $event)"
            @mouseout="imageMouseout(item?.webviewUrl, $event)">
          </td>
          <td class="cursor image-name" @click="openFile(item.local)">{{ item?.local || '' }}</td>
          <td class="cursor" @click="copy(item.url)">
            {{ item.url }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <ImagePreview :url="url" :showPreview="show" :x="x + 10" :y="y + 10" />
</template>

<style scoped lang="scss">
.panel {
  background-color: #272822;
  .total {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .column2 {
    min-width: 150px;
  }
  .column4, .column5 {
    max-width: 500px;
  }
  table, tr, td, th {
    border: 1px solid #fff;
    border-collapse: collapse;
  }
  td, th {
    padding: 10px;
  }
  .cursor {
    cursor: pointer;
  }
  .image-name:hover {
    color: rgb(116, 94, 224);
  }
}
</style>
