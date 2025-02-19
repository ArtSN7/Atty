import sqlalchemy as sqla
import sqlalchemy.orm as orm
from sqlalchemy.orm import Session
import sqlalchemy.ext.declarative as dec

SqlAlchemyBase = dec.declarative_base()

__factory = None


def global_init(db_file):
    global __factory

    if __factory:
        return

    if not db_file or not db_file.strip():
        raise Exception("File path is empty.")

    conn_str = f'sqlite:///{db_file.strip()}?check_same_thread=False'
    print(f"DB connection string: {conn_str}")

    engine = sqla.create_engine(conn_str, echo=False, pool_pre_ping=True)

    __factory = orm.sessionmaker(bind=engine)

    SqlAlchemyBase.metadata.create_all(engine)


def create_session() -> Session:
    global __factory
    return __factory()
