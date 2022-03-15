import enum


class BaseEnum(enum.Enum):
    @classmethod
    def choices(cls):
        return list((i.value, i.value) for i in cls.__members__.values())

    def __str__(self):
        return self.value

    def __eq__(self, other):
        return str(self) == str(other)
