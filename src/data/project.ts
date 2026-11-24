type ProjectActivity =
  | { kind: 'image'; src: string; caption: string; width: number; height: number }
  | { kind: 'video'; src: string; caption: string }

export const projectActivity: ProjectActivity[] = []
export const projectResults: { title: string; date: string; sourceUrl: string }[] = []
