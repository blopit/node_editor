// src/components/nodeTypes.js
import CustomNode from './CustomNode';
import AddNode from './AddNode';
import MultiplyNode from './MultiplyNode';
import Trigger from './Trigger';
import SingleAgent from './SingleAgent';
import CapitalizeNode from './CapitalizeNode';
import DataValidatorNode from './DataValidatorNode';
import TextInputNode from './TextInputNode';
import ApiProcessorNode from './ApiProcessorNode';
import TextDisplayNode from './TextDisplayNode';

export const nodeTypes = {
  trigger: Trigger,
  customNode: CustomNode,
  addNode: AddNode,
  multiplyNode: MultiplyNode,
  singleAgent: SingleAgent,
  capitalize: CapitalizeNode,
  dataValidator: DataValidatorNode,
  textInput: TextInputNode,
  apiProcessor: ApiProcessorNode,
  textDisplay: TextDisplayNode,
};
