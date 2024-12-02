import { createStackNavigator } from '@react-navigation/stack';
import StackNavigator from './navigation/StackNavigator';

const Stack = createStackNavigator();

export default function App() {
  return <StackNavigator />;
}