SnapSerializer.prototype.loadBlock = function (model, isReporter) {
    // private
    var block, info, inputs, isGlobal, rm, receiver;
    if (model.tag === 'block') {
        if (Object.prototype.hasOwnProperty.call(
                model.attributes,
                'var'
            )) {
            return SpriteMorph.prototype.variableBlock(
                model.attributes['var']
            );
        }
        block = SpriteMorph.prototype.blockForSelector(model.attributes.s);
    } else if (model.tag === 'custom-block') {
        isGlobal = model.attributes.scope ? false : true;
        receiver = isGlobal ? this.project.stage
            : this.project.sprites[model.attributes.scope];
        rm = model.childNamed('receiver');
        if (rm && rm.children[0]) {
            receiver = this.loadValue(
                model.childNamed('receiver').children[0]
            );
        }
        if (!receiver) {
            return this.obsoleteBlock(isReporter);
        }
        if (isGlobal) {
            info = detect(receiver.globalBlocks, function (block) {
                return block.blockSpec() === localize(model.attributes.s);
            });
            if (!info && this.project.targetStage) { // importing block files
                info = detect(
                    this.project.targetStage.globalBlocks,
                    function (block) {
                        return block.blockSpec() === model.attributes.s;
                    }
                );
            }
        } else {
            info = detect(receiver.customBlocks, function (block) {
                return block.blockSpec() === model.attributes.s;
            });
        }
        if (!info) {
			console.log('yep');
            return this.obsoleteBlock(isReporter);
        }
        block = info.type === 'command' ? new CustomCommandBlockMorph(
            info,
            false
        ) : new CustomReporterBlockMorph(
            info,
            info.type === 'predicate',
            false
        );
    }
    if (block === null) {
        block = this.obsoleteBlock(isReporter);
    }
    block.isDraggable = true;
    inputs = block.inputs();
    model.children.forEach(function (child, i) {
        if (child.tag === 'comment') {
            block.comment = this.loadComment(child);
            block.comment.block = block;
        } else if (child.tag === 'receiver') {
            nop(); // ignore
        } else {
            this.loadInput(child, inputs[i], block);
        }
    }, this);
    return block;
};

