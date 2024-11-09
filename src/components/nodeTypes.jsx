// src/components/nodeTypes.js
import CustomNode from './CustomNode';
import AddNode from './AddNode';
import MultiplyNode from './MultiplyNode';
import Trigger from './Trigger';
import SingleAgent from './SingleAgent';
import CapitalizeNode from './CapitalizeNode';

export const nodeTypes = {
  trigger: Trigger,
  customNode: CustomNode,
  addNode: AddNode,
  multiplyNode: MultiplyNode,
  singleAgent: SingleAgent,
  capitalize: CapitalizeNode,
};
