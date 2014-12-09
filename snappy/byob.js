CustomBlockDefinition.prototype.originalBlockSpec = CustomBlockDefinition.prototype.blockSpec;
CustomBlockDefinition.prototype.blockSpec = function () {
	return localize(this.originalBlockSpec());
};

