import {
  ColorPicker, ColorPickerArea, ColorPickerSlider, ColorPickerInput,
  ColorPickerPreview, ColorPickerEyeDropper, ColorPickerFormatSelect,
  type ColorFormat,
} from '@booleanpress/ui/color-picker';

const onFormatChange = (format: ColorFormat) => format;
<ColorPicker defaultFormat="oklcha" onFormatChange={onFormatChange} defaultValue="oklch(60% 0.1 200)">
  <ColorPickerArea />
  <ColorPickerSlider channel="chroma" format="oklcha" />
  <ColorPickerInput channel="css" />
  <ColorPickerPreview />
  <ColorPickerEyeDropper />
  <ColorPickerFormatSelect />
</ColorPicker>;
// @ts-expect-error formats are a documented finite set
<ColorPicker format="cmyk" />;
// @ts-expect-error numeric channels are a documented finite set
<ColorPickerSlider channel="cyan" />;
