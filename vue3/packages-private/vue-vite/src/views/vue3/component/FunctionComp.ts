import { defineComponent, h } from 'vue'

const FunctionalComponent = props => h('div', props.msg)
FunctionalComponent.props = ['msg']

const DefineFunctionComponent = defineComponent({
  props: ['msg'],
  setup(props) {
    return () => h('div', props.msg)
  },
})

export { FunctionalComponent, DefineFunctionComponent }
