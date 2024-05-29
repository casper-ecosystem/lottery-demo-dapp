export interface DeployMessage {
	detected_deploy: {
		error?: string | null;
		deployHash: string;
	};
}
