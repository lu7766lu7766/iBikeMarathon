<template>
  <b-container fluid>
    <b-row>
      <b-col offset="3" lg="6">
        <b-overlay :show="isLoading" rounded="sm">
          <h3>iBike 馬拉松</h3>
          <b-form-group label="騎車速度(可分段調整)">
            <b-input-group>
              <b-form-input
                v-model="rideSpeed"
                type="range"
                number
                min="5"
                max="70"
                step="1"
              ></b-form-input>
              <b-input-group-append is-text class="text-monospace">
                {{ rideSpeed }}km/hr
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
          <b-form-group
            :label="state.stations.length ? '下一站' : '第一站(步行)'"
          >
            <b-input-group>
              <select class="form-control" v-model="selectedStationID">
                <option value="">請選擇</option>
                <option
                  v-for="position in state.positions"
                  :key="position.ID"
                  :value="position.ID"
                >
                  {{ position.displayName }}
                </option>
              </select>
              <b-button variant="outline-primary" @click="onSubmit()">
                送出
              </b-button>
            </b-input-group>
          </b-form-group>
          <b-form-group label="行程">
            <b-table
              striped
              hover
              foot-clone
              caption-top
              :items="state.stations"
              :fields="[
                { key: 'index', label: '站數' },
                { key: 'name', label: '站名' },
                { key: 'distance', label: '距離' },
                { key: 'costTime', label: '預計花費時間' },
              ]"
            >
              <template #table-caption>
                <span class="text-danger"> iBike租還有半小時等待時間 </span>
              </template>

              <template #cell(index)="data">
                {{ data.index + 1 }}{{ !data.index ? '(步行5km/hr)' : '' }}
              </template>
              <template #cell(distance)="data">
                {{ data.item.distance + "km" }}
              </template>
              <template #cell(costTime)="data">
                {{ data.item.costTime + "hr" }}
              </template>

              <template #foot(index)> 小計 </template>
              <template #foot(name)>
                共計{{ state.stations.length }}站
              </template>
              <template #foot(distance)>
                {{ state.total.distance }}km
              </template>
              <template #foot(costTime)>
                {{ state.total.costTime }}hr
              </template>
            </b-table>
          </b-form-group>
        </b-overlay>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { ref, reactive, onMounted, computed } from '@vue/composition-api'
import axios from 'axios'
import Decimal from 'decimal.js'
import CountDistance from '@/service/CountDistance'
import GetLocation from '@/service/GetLocation'
import _ from 'lodash'
import { BContainer, BRow, BCol, BFormGroup, BInputGroup, BInputGroupAppend, BOverlay, BFormInput, BButton, BTable } from 'bootstrap-vue'
export default {
  name: 'iBikeMarathon',
  components: {
    BContainer, BRow, BCol, BFormGroup, BInputGroup, BInputGroupAppend, BOverlay, BFormInput, BButton, BTable
  },
  setup(context, { attrs }) {

    const isLoading = ref(true)
    const rideSpeed = ref(10)
    const selectedStationID = ref("")
    // const stations = reactive([])
    const options = reactive({
      positions: []
    })
    const location = reactive({
      lat: 24.1693819, lng: 120.6754897
    })

    const getLocation = async () => {
      const WAITING_FOR_MIN_SECS = 2000
      setTimeout(() => isLoading.value = false, WAITING_FOR_MIN_SECS)
      const res = await GetLocation()
      Object.assign(location, res)
    }
    const getPositions = async () => {
      const res = await axios.get('https://datacenter.taichung.gov.tw/swagger/OpenData/91deb8b8-7547-4a60-8cae-7c95c0df2fda')
      options.positions = res.data
    }
    const onSubmit = () => {
      const distance = CountDistance(location.lat, location.lng, state.selectedStation.Y, state.selectedStation.X).toFixed(2)
      // 第一站為步行時速
      const WALK_SPEED = 5
      const realSpeed = state.stations.length ? rideSpeed.value : WALK_SPEED
      const costTime = new Decimal(distance).div(realSpeed).toFixed(2)
      state.stations.push({
        'name': state.selectedStation.name,
        'distance': distance,
        'costTime': costTime,
      })
      location.lat = state.selectedStation.Y
      location.lng = state.selectedStation.X
    }

    // const positions = computed(() => {
    //   return _.orderBy(options.positions.map(x => {
    //     const distance = CountDistance(location.lat, location.lng, x.Y, x.X)
    //     return {
    //       ...x,
    //       distance,
    //       displayName: `${x.Position} ${distance.toFixed(2)}km`,
    //       name: x.Position
    //     }
    //   }), 'distance')
    // })
    const state = reactive({
      stations: [],
      positions: computed(() => {
        return _.orderBy(options.positions.map(x => {
          const distance = CountDistance(location.lat, location.lng, x.Y, x.X)
          return {
            ...x,
            distance,
            displayName: `${x.Position} ${distance.toFixed(2)}km`,
            name: x.Position
          }
        }), 'distance')
      }),
      selectedStation: computed(() => _.find(state.positions, x => x.ID === selectedStationID.value)),
      total: computed(() => {
        const IBIKE_BORROW_RETURN_COST_TIME = 0.5
        return {
          distance: state.stations.reduce((res, x) => new Decimal(res).plus(x.distance).toFixed(2), 0),
          costTime: state.stations.reduce((res, x, i) => new Decimal(res).plus(x.costTime).plus(i ? IBIKE_BORROW_RETURN_COST_TIME : 0).toFixed(2), 0)
        }
      })
    })
    // const selectedStation = computed(() => _.find(positions.value, x => x.ID === selectedStationID.value))
    // const countDistance = () => stations.reduce((res, x) => new Decimal(res).plus(x.distance).toFixed(2), 0)
    // iBike租還時間
    // const IBIKE_BORROW_RETURN_COST_TIME = 0.5
    // const countCostTime = () => stations.reduce((res, x, i) => new Decimal(res).plus(x.costTime).plus(i ? IBIKE_BORROW_RETURN_COST_TIME : 0).toFixed(2), 0)
    // computed not work is bug??
    // const total = computed(() => {
    //   const IBIKE_BORROW_RETURN_COST_TIME = 0.5
    //   return {
    //     distance: stations.reduce((res, x) => new Decimal(res).plus(x.distance).toFixed(2), 0),
    //     costTime: stations.reduce((res, x, i) => new Decimal(res).plus(x.costTime).plus(i ? IBIKE_BORROW_RETURN_COST_TIME : 0).toFixed(2), 0)
    //   }
    // })

    onMounted(() => {
      getLocation()
      getPositions()
    })

    return {
      selectedStationID,
      isLoading,
      rideSpeed,
      state,
      // positions,
      // stations,
      // countDistance,
      // countCostTime,
      onSubmit
    }
  }
}
</script>

<style scoped lang="stylus"></style>
