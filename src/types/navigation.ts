// Navegação de pilha (Stack)
export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  AlertList: undefined;
  Map: undefined;
  AddAlert: undefined;
  SensorStatus: undefined;
  AlertDetail: { alertId: string };
  EditAlert: { alertId: string };
};

// Navegação por abas (Bottom Tabs)
export type RootTabParamList = {
  AlertListTab: undefined;
  MapTab: undefined;
  AddAlertTab: undefined;
  SensorStatusTab: undefined;
  ProfileTab: undefined;
  RiskAnalysis: undefined;
};
