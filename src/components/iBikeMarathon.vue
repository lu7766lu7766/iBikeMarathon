<template>
  <b-container fluid>
    <b-row>
      <b-col offset="3" lg="6">
        <b-overlay :show="isLoading" rounded="sm">
          <b-form-group label="Speed">
            <b-input-group>
              <b-form-input
                v-model="speed"
                type="range"
                number
                min="5"
                max="70"
                step="1"
              ></b-form-input>
              <b-input-group-append is-text class="text-monospace">
                {{ speed }}km/hr
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
          <b-form-group label="Next Stop">
            <b-input-group>
              <select class="form-control" v-model="editData.selection">
                <option value="">請選擇</option>
                <option
                  v-for="position in positions"
                  :key="position.ID"
                  :value="position.ID"
                >
                  {{ position.Position }}
                </option>
              </select>
              <b-button variant="outline-primary"> Submit </b-button>
            </b-input-group>
          </b-form-group>
          <b-form-group label="Schedule"> </b-form-group>
        </b-overlay>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { ref, reactive, onMounted, computed } from '@vue/composition-api'
import axios from 'axios'
import CountDistance from '@/service/CountDistance'
import GetLocation from '@/service/GetLocation'
import _ from 'lodash'
import { BContainer, BRow, BCol, BFormGroup, BInputGroup, BInputGroupAppend, BOverlay, BFormInput, BButton } from 'bootstrap-vue'
export default {
  name: 'iBikeMarathon',
  components: {
    BContainer, BRow, BCol, BFormGroup, BInputGroup, BInputGroupAppend, BOverlay, BFormInput, BButton
  },
  setup(context, { attrs }) {

    const isLoading = ref(true)

    const speed = ref(10)

    const options = reactive({
      positions: []
    })

    const editData = reactive({
      selection: '',
    })

    const location = reactive({
      lat: 24.1693819, lng: 120.6754897
    })

    const getLocation = async () => {
      setTimeout(() => isLoading.value = false, 5000)
      const res = await GetLocation()
      Object.assign(location, res)
    }

    const getPositions = async () => {
      const res = await axios.get('https://datacenter.taichung.gov.tw/swagger/OpenData/91deb8b8-7547-4a60-8cae-7c95c0df2fda')
      options.positions = res.data
    }

    const positions = computed(() => {
      return _.orderBy(options.positions.map(x => {
        const distance = CountDistance(location.lat, location.lng, x.Y, x.X)
        return {
          ...x,
          distance,
          Position: `${x.Position} ${distance.toFixed(2)}km`
        }
      }), 'distance')
    })

    onMounted(async () => {
      getLocation()
      getPositions()
    })

    return {
      positions,
      isLoading,
      speed,
      editData
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus"></style>
