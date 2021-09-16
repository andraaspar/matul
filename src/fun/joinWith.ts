export function joinWith(joiner: string, ...s: any[]) {
	return s.filter(Boolean).join(joiner);
}
