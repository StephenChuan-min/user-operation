import {
  ElButton,
  ElAside,
  ElAffix,
  ElContainer,
  ElForm,
  ElFormItem,
  ElHeader,
  ElIcon,
  ElInput,
  ElInputNumber,
  ElMain,
  ElMenu,
  ElMenuItem,
  ElPagination,
  ElSubmenu,
  ElTable,
  ElTableColumn,
  ElTabs,
  ElImage,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElDialog,
  ElMessage,
  ElMessageBox,
  ElDatePicker,
  ElLoading,
  ElTooltip,
  ElSelect,
  ElOption,
  ElTree,
  ElCheckbox,
  ElTabPane,
  ElLink,
  ElDivider,
  ElTimeline,
  ElTimelineItem,
  ElPopover,
  ElCol,
  ElRadioGroup,
  ElRadio,
  ElCheckboxGroup,
  ElCheckboxButton,
  ElRadioButton,
  ElProgress,
} from 'element-plus';

['success', 'warning', 'info', 'error'].forEach((type) => {
  ElMessage[type] = (options) => {
    if (typeof options === 'string') {
      // eslint-disable-next-line no-param-reassign
      options = {
        message: options,
        type,
      };
    } else {
      // eslint-disable-next-line no-param-reassign
      options.type = type;
    }
    return ElMessage({ ...options, offset: 340 });
  };
});

const list = [
  ElButton,
  ElAside,
  ElAffix,
  ElContainer,
  ElForm,
  ElFormItem,
  ElHeader,
  ElIcon,
  ElInput,
  ElInputNumber,
  ElMain,
  ElMenu,
  ElMenuItem,
  ElPagination,
  ElSubmenu,
  ElTable,
  ElTableColumn,
  ElTabs,
  ElImage,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElDialog,
  ElMessage,
  ElMessageBox,
  ElDatePicker,
  ElLoading,
  ElTooltip,
  ElSelect,
  ElOption,
  ElTree,
  ElCheckbox,
  ElTabPane,
  ElLink,
  ElDivider,
  ElTimeline,
  ElTimelineItem,
  ElCol,
  ElRadioGroup,
  ElRadio,
  ElCheckbox,
  ElCheckboxGroup,
  ElCheckboxButton,
  ElRadioButton,
  ElProgress,
  ElPopover,
];

export default (app) => {
  list.forEach((i) => app.use(i));
};
