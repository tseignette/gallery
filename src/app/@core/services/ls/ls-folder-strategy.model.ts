import { LsStrategy } from "./ls-strategy.model";
import { Folder } from "../../models";

export class LsFolderStrategy extends LsStrategy {

  async continue(fileList: Folder, depth: number) {
    this.output = fileList;

    return depth !== 0;
  }

}
