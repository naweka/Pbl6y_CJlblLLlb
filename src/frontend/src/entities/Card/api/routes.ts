export const routes = {
	create: () => '/createCard',
	update: () => '/updateCard',
	getAll: () => '/getCards',
	get: () => '/getCard',
	getFiles: () => '/getFilesByCard',
	getSettingsFile: (fileId: string) => `/getModelSettingsForFile/${fileId}`,
	updateSettingsFile: () => '/overrideModelSettingsForFile',
}
