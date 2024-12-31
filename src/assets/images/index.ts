import ImageAppSource from './App';
import ImageCommonSource from './Common';
import ImageComponentsSource from './Components';

const ImageSource = {
  ...ImageAppSource,
  ...ImageCommonSource,
  ...ImageComponentsSource,
};

export default ImageSource;
