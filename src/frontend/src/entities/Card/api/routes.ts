export const routes = {
	create: () => '/createCard',
	update: () => '/updateCard',
	delete: () => '/deleteCard',
	getAll: () => '/getCards',
	get: () => '/getCard',
	getFiles: () => '/getFilesByCard',
	getSettingsFile: (fileId: string) => `/getModelSettingsForFile/${fileId}`,
	getDefaultSettingsFile: () => `/getDefaultModelSettingsForFile`,
	updateSettingsFile: () => '/overrideModelSettingsForFile',
	updateDefaultSettingsFile: () => '/overrideDefaultModelSettingsForFile',
}
