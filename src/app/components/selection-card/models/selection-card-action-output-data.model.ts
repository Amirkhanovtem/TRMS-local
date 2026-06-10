export interface SelectionCardActionOutputDataModel<D> {
  data: D;
  action: 'activate' | 'deactivate';
}
