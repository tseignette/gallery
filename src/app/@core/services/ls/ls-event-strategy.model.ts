import { LsStrategy } from "./ls-strategy.model";
import { Folder } from "../../models";

export class LsEventStrategy extends LsStrategy {

  // TODO:
  async continue(fileList: Folder, depth: number) {
    return false;
  }

}
