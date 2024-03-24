import "./Folder.css";

import { FolderOutlined } from "@ant-design/icons";
import { Flex, Typography } from "antd";
const { Text } = Typography;

type FolderProps = {
  currentPath: string;
  path: string;
  onPathChange: (path: string) => void;
};

const Folder = ({
  currentPath,
  path,
  onPathChange,
}: FolderProps): JSX.Element => {
  let folderName: string;
  if (currentPath === "") {
    folderName = path.split("/")[0];
  } else {
    folderName = path.replace(currentPath, "").split("/")[0];
  }

  return (
    <Flex
      vertical
      className="folder-item"
      align="center"
      style={{ cursor: "pointer" }}
      onClick={() => {
        onPathChange(`${currentPath}${folderName}/`);
      }}
    >
      <FolderOutlined style={{ fontSize: "5em", color: "#092954" }} />
      <Text>{folderName}</Text>
    </Flex>
  );
};

export default Folder;
