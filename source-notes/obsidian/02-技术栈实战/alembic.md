1.一个python标准包 安装
uv add alembic
2.初始化
alembic init alembic


├── alembic.ini          # 配置文件（入口）
├── alembic/             # 自动生成的文件夹
│   ├── env.py           # 核心脚本：连接你的代码和数据库
│   ├── README
│   ├── script.py.mako   # 迁移脚本的模板
│   └── versions/        # 存放所有历史版本脚本的文件夹（空）
└── models/              # 你的模型


3.常用命令基准

在开发流程中，你只需要记住这三个最常用的命令：
alembic revision --autogenerate -m "add 2 file talbe"
alembic upgrade head
1. **生成记录（Revision）**： `alembic revision --autogenerate -m "描述你的改动"` _基准：_ 每次修改了 `models/` 下的 Python 类后，**必须**运行这个。
    
2. **同步到数据库（Upgrade）**： `alembic upgrade head` _基准：_ 运行完 Revision 后，或者 `git pull` 了同事的代码后，**必须**运行这个。
    
3. **查看状态（History/Current）**： `alembic history --verbose`（查看所有版本） `alembic current`（查看当前数据库处于哪个版本）