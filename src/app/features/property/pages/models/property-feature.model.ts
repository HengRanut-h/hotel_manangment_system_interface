export interface PropertyFeature {
  key: string;
  title: string;
  description: string;
  route: string;
  permission: string;
  icon:
    | 'hotel'
    | 'git-branch'
    | 'building'
    | 'layers'
    | 'bed-double'
    | 'door-open'
    | 'sparkles'
    | 'badge-dollar-sign';
}
