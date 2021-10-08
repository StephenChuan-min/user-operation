import {
  defineComponent,
  reactive,
  computed,
  watch,
  onMounted,
} from 'vue';
import CountTo from '@/components/vue-count-to/vue-countTo.vue';

export default defineComponent({
  props: {
    type: {
      type: String,
      default: () => 'circle',
    },
    strokeWidth: {
      type: Number,
      default: () => 9.6,
    },
    percentage: {
      type: Number,
      default: () => 0,
    },
    width: {
      type: Number,
      default: () => 126,
    },
    duration: {
      type: Number,
      default: () => 2000,
    },
  },
  setup(props) {
    const d = `
      M 50 50
      m 0 -45
      a 45 45 0 1 1 0 90
      a 45 45 0 1 1 0 -90
    `;
    const currentVal = reactive({
      value: 0,
    });

    const changeCircleValue = () => {
      const timer = setInterval(() => {
        currentVal.value += (props.duration / props.percentage);
        if (currentVal.value >= props.percentage) {
          currentVal.value = props.percentage;
          clearInterval(timer);
        }
      }, 1000 / 60);
    };

    const radius = computed(() => {
      if (props.type === 'circle' || props.type === 'dashboard') {
        return parseInt(`${50 - parseFloat(props.strokeWidth) / 2}`, 10);
      }
      return 0;
    });

    const perimeter = computed(() => 2 * Math.PI * radius.value);

    const trailPathStyle = computed(() => (
      {
        strokeDasharray: `${perimeter.value}px, ${perimeter.value}px`,
        strokeDashoffset: 0,
      }
    ));

    const circlePathStyle = computed(() => (
      {
        strokeDasharray: `${perimeter.value * (currentVal.value / 100)}px, ${perimeter.value}px`,
        strokeDashoffset: 0,
        transition: 'stroke-dasharray 0.6s ease 0s, stroke 0.6s ease',
      }
    ));

    const slotStyle = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: 'unset',
      textAlign: 'center',
    };

    watch(() => props.percentage, () => {
      currentVal.value = 0;
      changeCircleValue();
    });

    onMounted(() => {
      changeCircleValue();
    });

    return {
      currentVal,
      d,
      circlePathStyle,
      trailPathStyle,
      slotStyle,
    };
  },
  render() {
    return (
      <div role="progressbar" aria-valuenow={this.currentVal.value} aria-valuemin="0" aria-valuemax="100" className="el-progress el-progress--circle">
        <div className="el-progress-circle" style={{ height: `${this.width}px`, width: `${this.width}px` }}>
          <svg viewBox="0 0 100 100">
            <defs>
              <linearGradient id="blue" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#1BBA7C;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#6BE7D8;stop-opacity:1" />
              </linearGradient>
            </defs>
            <path d={this.d} stroke="#E5E8F0" stroke-width={this.strokeWidth} fill="none" className="el-progress-circle__track" style={this.trailPathStyle}>
            </path>
            <path d={this.d} stroke="url(#blue)" fill="none" stroke-linecap="round" stroke-width={this.strokeWidth} className="el-progress-circle__path" style={this.circlePathStyle}>
            </path>
          </svg>
        </div>
        <div className="el-progress-bar__innerText" style={this.slotStyle}>
          <div className="percentage-label">数据同步率</div>
          <CountTo startVal={0} endVal={this.percentage} suffix="%" decimals={2} />
        </div>
      </div>
    );
  },
});
