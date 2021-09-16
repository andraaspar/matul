const indentRe = /^/gm;

export function indent(s: string, c = "\t") {
	return s ? s.replace(indentRe, c) : s;
}
