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
import RoleCreatorNode from './RoleCreatorNode';
import TriagerNode from './TriagerNode';

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
  roleCreator: RoleCreatorNode,
  triagerNode: TriagerNode,
};