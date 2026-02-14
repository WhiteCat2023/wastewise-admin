export const isBlankInput = (value) => {
	if (value === null || value === undefined) {
		return true
	}

	if (typeof value === 'string') {
		return value.trim().length === 0
	}

	return String(value).trim().length === 0
}
