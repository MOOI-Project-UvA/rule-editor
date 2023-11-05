const frameTypes =
    [
        {
            'id': 'fact',
            'class': 'fact',
            'label': 'Fact',
            'subTypes': [
                {
                    'id': 'agent',
                    'class': 'fact',
                    'label': 'Agent'
                },
                {
                    'id': 'action',
                    'class': 'fact',
                    'label': 'Action'
                },
                {
                    'id': 'object',
                    'class': 'fact',
                    'label': 'Object'
                },

                {
                    'id': 'duty',
                    'class': 'fact',
                    'label': 'Duty'
                }
            ]
        },
        {
            'id': 'act',
            'class': 'relation',
            'label': 'Act'
        },
        {
            'id': 'claim_duty',
            'class': 'relation',
            'label': 'Claim-duty'
        }
    ]

export {
    frameTypes
}