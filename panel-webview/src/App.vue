<script setup lang="ts">
import ImagePreview from './ImagePreview.vue';
import { ref } from 'vue';
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
  deleted: boolean;
}[]>([]);
const isDarkTheme = ref(true);

const x = ref(0);
const y = ref(0);
const url = ref();
const show = ref(false);

const showImgLocalMenu = ref(false);
const imgLocalMenuUrl = ref('');
const menuPosition = ref({
  x: 0,
  y: 0
});

window.addEventListener('message', event => {
  const message = event.data;
  switch (message.command) {
    case 'img':
      const data = message?.data?.img;
      images.value = data.map((i: any) => ({
        ...i,
        deleted: false,
      }));
      break;
    case 'deleteLocalImgSuccess':
      images.value = images.value.map((i: any) => {
        if (i.local === message?.data) {
          return {
            ...i,
            deleted: true,
          }
        }
      });
      break;
    case 'theme':
      const theme = message?.data;
      console.log(theme, 'theme看看');
      isDarkTheme.value = theme;
      break;
  }
});

vscode.postMessage({
  command: 'getTheme',
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

const imgLocalMenu = (e: any, img: string) => {
  e?.preventDefault?.();
  if (img) {
    imgLocalMenuUrl.value = img;
    showImgLocalMenu.value = true;
    menuPosition.value = {
      x: e.clientX,
      y: e.clientY,
    }
  }
};

const deleteLocalImg = () => {
  vscode.postMessage({
    command: 'deleteLocalImg',
    data: imgLocalMenuUrl.value,
  });
};

document.addEventListener('click', () => {
  showImgLocalMenu.value = false;
});
</script>

<template>
  <div :class="{ panel: true, 'white-theme': !isDarkTheme }" >
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
        <tr v-for="(item, index) in images" :key="index" :class="item?.deleted ? 'deleted' : ''">
          <td>{{ index + 1 }}</td>
          <td>{{ item.size }}</td>
          <td>
            <img :src="item?.webviewUrl || ''" alt="" @mouseover="imageMouseover(item?.webviewUrl, $event)"
            @mouseout="imageMouseout(item?.webviewUrl, $event)">
          </td>
          <td class="cursor image-name" @click="openFile(item.local)"
            @contextmenu="(e) => imgLocalMenu(e, item?.local)"
          >{{ item?.local || '' }}</td>
          <td class="cursor" @click="copy(item.url)">
            {{ item.url }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <ImagePreview :url="url" :showPreview="show" :x="x + 10" :y="y + 10" />
  <div class="img-local-menu" :style="{
    top: `${menuPosition.y}px`,
    left: `${menuPosition.x}px`,
    display: showImgLocalMenu ? 'block' : 'none',
  }">
    <div class="img-local-menu-item" @click="deleteLocalImg">delete</div>
  </div>
</template>

<style scoped lang="scss">
.white-theme {
  background-color: #fff!important;
  color: #000;
}
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
  .deleted td {
    text-decoration: line-through;
  }
  .cursor {
    cursor: pointer;
  }
  .image-name:hover {
    color: rgb(116, 94, 224);
  }
}
.img-local-menu {
  display: none;
  position: fixed;
  min-width: 100px;
  background-color: #B8B9B7;
  border-radius: 8px;
  padding: 10px;
  .img-local-menu-item {
    padding-left: 10px;
    line-height: 30px;
    border-radius: 8px;
    font-size: 12px;
    color: #000;
    &:hover {
      color: #fff;
      background-color: #336ED1;
    }
  }
}
</style>
