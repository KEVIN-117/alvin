function App() {
    const { Container, Row, Col } = ReactBootstrap;
    return (
        <Container>
            <Row>
                <Col md={{ offset: 3, span: 6 }}>
                    <TodoListCard />
                </Col>
            </Row>
        </Container>
    );
}

function TodoListCard() {
    const [items, setItems] = React.useState(null);

    React.useEffect(() => {
        fetch('/items')
            .then((r) => r.json())
            .then(setItems);
    }, []);

    const onNewItem = React.useCallback(
        (newItem) => {
            setItems([...items, newItem]);
        },
        [items],
    );

    if (items === null) return 'Loading...';

    return (
        <React.Fragment>
            <AddItemForm onNewItem={onNewItem} />
            {items.length === 0 && (
                <p className="text-center">No items yet! Add one above!</p>
            )}
            {items.map((item) => (
                <ItemDisplay item={item} key={item.id} />
            ))}
        </React.Fragment>
    );
}

function AddItemForm({ onNewItem }) {
    const { Form, InputGroup, Button } = ReactBootstrap;

    const [newItem, setNewItem] = React.useState({ title: '', author: '' });
    const [submitting, setSubmitting] = React.useState(false);

    const submitNewItem = (e) => {
        e.preventDefault();
        setSubmitting(true);
        fetch('/items', {
            method: 'POST',
            body: JSON.stringify(newItem),
            headers: { 'Content-Type': 'application/json' },
        })
            .then((r) => r.json())
            .then((item) => {
                onNewItem(item);
                setSubmitting(false);
                setNewItem('');
            });
    };

    return (
        <Form onSubmit={submitNewItem}>
            <InputGroup className="mb-3">
                <Form.Control
                    value={newItem.title}
                    onChange={(e) =>
                        setNewItem({ ...newItem, title: e.target.value })
                    }
                    type="text"
                    placeholder="Titulo del libro"
                    aria-describedby="basic-addon1"
                />
                <Form.Control
                    value={newItem.author}
                    onChange={(e) =>
                        setNewItem({ ...newItem, author: e.target.value })
                    }
                    type="text"
                    placeholder="Autor del libro"
                    aria-describedby="basic-addon1"
                />
                <InputGroup.Append>
                    <Button
                        type="submit"
                        variant="success"
                        disabled={!newItem.title.length}
                        className={submitting ? 'disabled' : ''}
                    >
                        {submitting ? 'Adding...' : 'Add Item'}
                    </Button>
                </InputGroup.Append>
            </InputGroup>
        </Form>
    );
}

function ItemDisplay({ item }) {
    const { Container, Row, Col } = ReactBootstrap;

    return (
        <Container fluid>
            <Row className="element">
                <Col xs={10} className="name element__children">
                    <p>{item.title}</p>
                    <p>{item.author}</p>
                </Col>
            </Row>
        </Container>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
