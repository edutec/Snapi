ListWatcherMorph.prototype.update = function (anyway) {
    var i, idx, ceil, morphs, cell, cnts, label, button, max,
        starttime, maxtime = 1000;

    this.frame.contents.children.forEach(function (m) {

        if (m instanceof CellMorph
                && m.contentsMorph instanceof ListWatcherMorph) {
            m.contentsMorph.update();
        }
    });

    if (this.lastUpdated === this.list.lastChanged && !anyway) {
        return null;
    }

    this.updateLength(true);

    // adjust start index to current list length
    this.start = Math.max(
        Math.min(
            this.start,
            Math.floor((this.list.length() - 1) / this.range)
                * this.range + 1
        ),
        1
    );

    // refresh existing cells
    // highest index shown:
    max = Math.min(
        this.start + this.range - 1,
        this.list.length()
    );

    // number of morphs available for refreshing
    ceil = Math.min(
        (max - this.start + 1) * 3,
        this.frame.contents.children.length
    );

    for (i = 0; i < ceil; i += 3) {
        idx = this.start + (i / 3);

        cell = this.frame.contents.children[i];
        label = this.frame.contents.children[i + 1];
        button = this.frame.contents.children[i + 2];
        cnts = this.list.at(idx);

        if (cell.contents !== cnts) {
            cell.contents = cnts;
            cell.drawNew();
            if (this.lastCell) {
                cell.setLeft(this.lastCell.left());
            }
        }
        this.lastCell = cell;

        if (label.text !== idx.toString()) {
            label.text = idx.toString();
            label.drawNew();
        }

        button.action = idx;
    }

    // remove excess cells
    // number of morphs to be shown
    morphs = (max - this.start + 1) * 3;

    while (this.frame.contents.children.length > morphs) {
        this.frame.contents.children[morphs].destroy();
    }

    // add additional cells
    ceil = morphs; //max * 3;
    i = this.frame.contents.children.length;

    starttime = Date.now();
    if (ceil > i + 1) {
        for (i; i < ceil; i += 3) {
            if (Date.now() - starttime > maxtime) {
                this.fixLayout();
                this.frame.contents.adjustBounds();
                this.frame.contents.setLeft(this.frame.left());
                return null;
            }
            idx = this.start + (i / 3);
            label = new StringMorph(
                idx.toString(),
                SyntaxElementMorph.prototype.fontSize,
                null,
                false,
                false,
                false,
                MorphicPreferences.isFlat ? new Point() : new Point(1, 1),
                new Color(255, 255, 255)
            );
            cell = new CellMorph(
                this.list.at(idx),
                this.cellColor,
                idx,
                this.parentCell
            );
            button = new PushButtonMorph(
                this.list.remove,
                idx,
                '-',
                this.list
            );
            button.padding = 1;
            button.edge = 0;
            button.corner = 1;
            button.outlineColor = this.color.darker();
            button.drawNew();
            button.fixLayout();

            this.frame.contents.add(cell);
            if (this.lastCell) {
                cell.setPosition(this.lastCell.bottomLeft());
            } else {
                cell.setTop(this.frame.contents.top());
            }
            this.lastCell = cell;
            label.setCenter(cell.center());
            label.setRight(cell.left() - 2);
            this.frame.contents.add(label);
            this.frame.contents.add(button);
        }
    }
    this.lastCell = null;

    this.fixLayout();
    this.frame.contents.adjustBounds();
    this.frame.contents.setLeft(this.frame.left());
    this.updateLength();
    this.lastUpdated = this.list.lastChanged;
}
