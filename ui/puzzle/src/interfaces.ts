import { CevalController, NodeEvals } from 'ceval';
import { Prop } from 'common';

export interface Controller {
  vm: Vm;
  getCeval(): CevalController;
  nextNodeBest(): string | undefined;
  disableThreatMode?: Prop<Boolean>;
  toggleThreatMode(): void;
  toggleCeval(): void;
  gameOver: (node?: Tree.Node) => 'draw' | 'checkmate' | false;
  mandatoryCeval?: Prop<boolean>;
  showEvalGauge: Prop<boolean>;
  currentEvals(): NodeEvals;
  ongoing: boolean;
  playUci(uci: string): void;
  getOrientation(): Color;
  threatMode: Prop<boolean>;
  getNode(): Tree.Node;
  showComputer(): boolean;
  [key: string]: any;
}

export interface Vm {
  path: Tree.Path;
  nodeList: Tree.Node[];
  node: Tree.Node;
  mainline: Tree.Node[];
  mode: 'play' | 'view' | 'try';
  loading: boolean;
  round: any;
  voted?: boolean;
  justPlayed?: Key;
  resultSent: boolean;
  lastFeedback: 'init' | 'fail' | 'win' | 'good' | 'retry';
  initialPath: Tree.Path;
  initialNode: Tree.Node;
  canViewSolution: boolean;
  autoScrollRequested: boolean;
  autoScrollNow: boolean;
  cgConfig: any;
  showComputer(): boolean;
  showAutoShapes(): boolean;
}